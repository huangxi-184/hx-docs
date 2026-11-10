<template>
  <div class="ncm-converter">
    <h1>NCM文件处理器(仅自用，解密算法由开源大佬提供)</h1>
    <button @click="handlePickFolder" :disabled="isProcessing">
      {{ isProcessing ? '处理中...' : '选择源文件夹' }}
    </button>

    <label class="opt-row">
      <input type="checkbox" v-model="forceOverwrite" :disabled="isProcessing" />
      强制重新转换全部文件（忽略已存在的 MP3）
    </label>

    <div class="status" :class="{ 'status-error': hasError }">
      <span v-if="hasError" class="error-icon">✗</span>
      <span v-else class="success-icon">✓</span>
      {{ statusMessage }}
      <div v-if="showProgress" class="progress-container">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div v-if="summary.total" class="summary">
        <span>共 {{ summary.total }} 个</span>
        <span class="ok">已转换 {{ summary.converted }}</span>
        <span class="skip">已跳过 {{ summary.skipped }}</span>
        <span v-if="summary.failed" class="bad">失败 {{ summary.failed }}</span>
      </div>
    </div>

    <div class="file-list">
      <h3>NCM文件列表：</h3>
      <ul>
        <li v-for="(file, index) in files" :key="index" :class="file.status">
          <span v-if="file.status === 'success'" class="success-icon">✓</span>
          <span v-else-if="file.status === 'error'" class="error-icon">✗</span>
          <span v-else-if="file.status === 'skipped'" class="skip-icon">↷</span>
          <span v-else>•</span>
          {{ file.path }}
          <span v-if="file.status === 'success'"
            >→ <strong>{{ file.outputName }}</strong></span
          >
          <span v-else-if="file.status === 'skipped'" class="skip-note"
            >→ {{ file.skipReason }}</span
          >
          <span v-if="file.status === 'error'">处理失败: {{ file.error }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// decrypt.js 是 1.2MB 的 UMD bundle（内含大量 Node polyfill 与编码码表），
// 只在点击后才用得到，所以放在 public/vendor 由脚本按需加载：
// 既不会进主包、不会被打进 prefetch，也避免了 rollup 对其中 eval 的告警。
const DECRYPT_SRC = '/vendor/decrypt.js'
let decryptPromise = null

const loadDecrypt = () => {
  if (window.decrypt) return Promise.resolve(window.decrypt)
  if (decryptPromise) return decryptPromise
  decryptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = DECRYPT_SRC
    script.async = true
    script.onload = () => {
      if (window.decrypt) resolve(window.decrypt)
      else {
        decryptPromise = null
        reject(new Error('解密引擎加载完成但未就绪'))
      }
    }
    script.onerror = () => {
      decryptPromise = null
      reject(new Error('解密引擎加载失败，请检查网络后重试'))
    }
    document.head.appendChild(script)
  })
  return decryptPromise
}

const toMp3Name = (name) => name.replace(/\.ncm$/i, '.mp3')

export default {
  name: 'NcmConverter',
  data() {
    return {
      isProcessing: false,
      hasError: false,
      forceOverwrite: false,
      statusMessage: '准备就绪，请选择包含NCM文件的文件夹',
      showProgress: false,
      progress: 0,
      files: [],
      summary: { total: 0, converted: 0, skipped: 0, failed: 0 }
    };
  },
  methods: {
    resetState() {
      this.hasError = false;
      this.statusMessage = '正在扫描文件夹...';
      this.showProgress = true;
      this.progress = 0;
      this.files = [];
      this.summary = { total: 0, converted: 0, skipped: 0, failed: 0 };
    },

    async handlePickFolder() {
      if (typeof window.showDirectoryPicker !== 'function') {
        this.hasError = true;
        this.statusMessage = '当前浏览器不支持文件系统访问 API，请使用 Chrome / Edge 86 及以上版本';
        return;
      }

      try {
        this.isProcessing = true;
        this.resetState();

        // 选择源目录（必须直接响应用户手势，不能先 await 别的异步操作，否则会丢手势）
        // id 让浏览器记住上次选择的位置，第二次直接回到同一个仓库目录
        const dirHandle = await window.showDirectoryPicker({ id: 'ncm-source', mode: 'read' });

        // 收集所有 .ncm 文件
        const ncmFiles = [];
        await this.processDirectory(dirHandle, ncmFiles, '');

        if (!ncmFiles.length) {
          this.showProgress = false;
          this.statusMessage = '所选文件夹中没有找到 NCM 文件';
          return;
        }

        this.summary.total = ncmFiles.length;
        this.statusMessage = `找到 ${ncmFiles.length} 个 NCM 文件，请选择保存 MP3 的文件夹...`;

        // 解密引擎与“用户选目录 + 比对已有文件”并行下载，省掉等待时间
        // 注意：先挂一个空 catch，避免用户取消第二次选目录时解密 Promise 变成未处理的 rejection
        const decryptReady = loadDecrypt();
        decryptReady.catch(() => {});

        const saveDirHandle = await window.showDirectoryPicker({ id: 'ncm-target', mode: 'readwrite' });

        // 防呆：两个仓库选成同一个目录时，MP3 会混进 NCM 仓库，直接中止
        if (await this.isSameDir(dirHandle, saveDirHandle)) {
          this.hasError = true;
          this.statusMessage = '目标文件夹与源文件夹相同，请分别选择 NCM 仓库和 MP3 仓库';
          return;
        }

        // 一次性建立目标目录索引：已存在的文件不再解密、不再写盘
        this.statusMessage = '正在比对目标文件夹中已有的 MP3...';
        const existing = this.forceOverwrite ? new Map() : await this.indexDirectory(saveDirHandle);

        const todo = [];
        const planned = new Set();

        for (const file of ncmFiles) {
          const mp3Name = toMp3Name(file.handle.name);
          const key = mp3Name.toLowerCase();

          if (planned.has(key)) {
            this.markSkipped(file, '存在同名歌曲，本批次只转换第一个');
            continue;
          }
          planned.add(key);

          if (!this.forceOverwrite && existing.has(key)) {
            const existed = await this.isRealFile(existing.get(key));
            if (existed) {
              this.markSkipped(file, '已存在，跳过');
              continue;
            }
          }

          todo.push({ ...file, mp3Name });
        }

        if (!todo.length) {
          this.progress = 100;
          this.showProgress = false;
          this.statusMessage = `全部 ${ncmFiles.length} 个文件均已存在，无需转换`;
          return;
        }

        this.statusMessage = this.forceOverwrite
          ? `开始重新转换 ${todo.length} 个文件...`
          : `需要转换 ${todo.length} 个文件（跳过 ${this.summary.skipped} 个已存在）...`;

        const decryptLib = await decryptReady;

        for (let i = 0; i < todo.length; i++) {
          const item = todo[i];
          this.progress = (i / todo.length) * 100;
          this.statusMessage = `正在处理: ${item.path} (${i + 1}/${todo.length})`;

          try {
            const ncmFile = await item.handle.getFile();
            const mp3Blob = await decryptLib.Decrypt(ncmFile);
            const mp3FileHandle = await saveDirHandle.getFileHandle(item.mp3Name, { create: true });
            const writable = await mp3FileHandle.createWritable();
            await writable.write(mp3Blob.blob);
            await writable.close();

            this.files[item.listIndex] = {
              path: item.path,
              outputName: item.mp3Name,
              status: 'success'
            };
            this.summary.converted++;
          } catch (err) {
            console.error(`文件处理失败: ${item.path}`, err);
            this.files[item.listIndex] = {
              path: item.path,
              error: err.message,
              status: 'error'
            };
            this.summary.failed++;
          }
        }

        this.progress = 100;
        const parts = [`转换 ${this.summary.converted} 个`];
        if (this.summary.skipped) parts.push(`跳过 ${this.summary.skipped} 个已存在`);
        if (this.summary.failed) parts.push(`失败 ${this.summary.failed} 个`);
        this.statusMessage = `处理完成：共 ${this.summary.total} 个文件，${parts.join('，')}`;
        this.hasError = this.summary.failed > 0 && this.summary.converted === 0;
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('操作失败:', err);
          this.hasError = true;
          this.statusMessage = `错误: ${err.message}`;
        } else {
          this.statusMessage = '已取消操作';
        }
      } finally {
        this.isProcessing = false;
      }
    },

    /**
     * 建立目标目录的文件名索引（key 统一小写，规避 Windows/macOS 大小写不敏感导致的重复文件）
     * 一次遍历即可，避免对每个待转文件单独做一次存在性探测
     */
    async indexDirectory(handle) {
      const map = new Map();
      for await (const [name, entry] of handle.entries()) {
        if (entry.kind === 'file') map.set(name.toLowerCase(), entry);
      }
      return map;
    },

    async isSameDir(a, b) {
      try {
        return await a.isSameEntry(b);
      } catch (err) {
        return false;
      }
    },

    // 0 字节文件视为上次写盘中断的残留，按“不存在”处理并重新转换
    async isRealFile(entry) {
      try {
        const file = await entry.getFile();
        return file.size > 0;
      } catch (err) {
        return false;
      }
    },

    markSkipped(file, reason) {
      this.summary.skipped++;
      this.files[file.listIndex] = { path: file.path, status: 'skipped', skipReason: reason };
    },

    async processDirectory(handle, fileList, path) {
      for await (const entry of handle.values()) {
        if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.ncm')) {
          const displayPath = path ? `${path}/${entry.name}` : entry.name;
          const listIndex = this.files.length;
          this.files.push({ path: displayPath, status: 'pending' });
          fileList.push({ handle: entry, path: displayPath, listIndex });
        } else if (entry.kind === 'directory') {
          await this.processDirectory(entry, fileList, path ? `${path}/${entry.name}` : entry.name);
        }
      }
    }
  }
};
</script>

<style scoped>
.ncm-converter {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  line-height: 1.6;
  background-color: white;
  /* 确保主背景为白色 */
}

button {
  background-color: #4361ee;
  /* 更柔和的蓝色 */
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(67, 97, 238, 0.2);
}

button:hover:not(:disabled) {
  background-color: #3a56d4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

button:disabled {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

.opt-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 0;
  font-size: 14px;
  color: #495057;
  cursor: pointer;
  user-select: none;
}

.opt-row input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.status {
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  font-weight: 500;
  border: 1px solid #f0f0f0;
  /* 添加细边框增强层次感 */
}

.status-error {
  color: #ef233c;
  /* 更现代的红色 */
  background-color: #fff5f5;
  /* 错误状态浅红色背景 */
}

.summary {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #495057;
}

.summary .ok {
  color: #2b8a3e;
}

.summary .skip {
  color: #868e96;
}

.summary .bad {
  color: #ef233c;
}

.file-list {
  margin-top: 20px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f0f0;
}

.file-list h3 {
  margin-top: 0;
  color: #4361ee;
  /* 与按钮颜色一致 */
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.file-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-list li {
  padding: 12px 15px;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
}

.file-list li.skipped {
  color: #868e96;
}

.file-list li.error {
  color: #ef233c;
}

.success-icon {
  color: #4cc9f0;
  /* 清新的蓝色 */
  margin-right: 8px;
}

.error-icon {
  color: #ef233c;
  /* 与错误状态一致 */
  margin-right: 8px;
}

.skip-icon {
  color: #adb5bd;
  margin-right: 8px;
}

.skip-note {
  margin-left: 8px;
  font-size: 13px;
}

.progress-container {
  margin-top: 15px;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4361ee, #4cc9f0);
  /* 渐变色进度条 */
  transition: width 0.3s ease;
}

@media (max-width: 600px) {
  .ncm-converter {
    padding: 15px;
  }

  button {
    width: 100%;
    padding: 15px;
  }
}
</style>
