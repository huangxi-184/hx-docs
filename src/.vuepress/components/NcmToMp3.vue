<template>
    <div class="ncm-converter">
        <h1>NCM文件处理器(仅自用,解密算法由开源大佬提供)</h1>
        <button @click="handlePickFolder" :disabled="isProcessing">
            {{ isProcessing ? '处理中...' : '选择源文件夹' }}
        </button>

        <div class="status" :class="{ 'status-error': hasError }">
            <span v-if="hasError" class="error-icon">✗</span>
            <span v-else class="success-icon">✓</span>
            {{ statusMessage }}
            <div v-if="showProgress" class="progress-container">
                <div class="progress-bar" :style="{ width: progress + '%' }"></div>
            </div>
        </div>

        <div class="file-list">
            <h3>NCM文件列表：</h3>
            <ul>
                <li v-for="(file, index) in files" :key="index" :class="file.status">
                    <span v-if="file.status === 'success'" class="success-icon">✓</span>
                    <span v-else-if="file.status === 'error'" class="error-icon">✗</span>
                    <span v-else>•</span>
                    {{ file.path }}
                    <span v-if="file.status === 'success'">→ <strong>{{ file.outputName }}</strong></span>
                    <span v-if="file.status === 'error'">处理失败: {{ file.error }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import "./decrypt.js"
export default {
    name: 'NcmConverter',
    data() {
        return {
            isProcessing: false,
            hasError: false,
            statusMessage: '准备就绪，请选择包含NCM文件的文件夹',
            showProgress: false,
            progress: 0,
            files: []
        }
    },
    methods: {
        async handlePickFolder() {
            try {
                this.isProcessing = true;
                this.hasError = false;
                this.statusMessage = '正在扫描文件夹...';
                this.showProgress = true;
                this.progress = 0;
                this.files = [];

                // 选择源目录
                const dirHandle = await window.showDirectoryPicker();

                // 收集所有.ncm文件
                const ncmFiles = [];
                await this.processDirectory(dirHandle, ncmFiles, '');

                this.statusMessage = `找到 ${ncmFiles.length} 个NCM文件，开始解码...`;

                // 选择目标目录
                this.statusMessage = '请选择保存MP3的文件夹...';
                const saveDirHandle = await window.showDirectoryPicker();

                // 处理文件
                for (let i = 0; i < ncmFiles.length; i++) {
                    const file = ncmFiles[i];
                    this.progress = (i / ncmFiles.length) * 100;
                    this.statusMessage = `正在处理: ${file.path} (${i + 1}/${ncmFiles.length})`;

                    try {
                        const ncmFile = await file.handle.getFile();
                        const mp3Blob = await decrypt.Decrypt(ncmFile);
                        const mp3Filename = file.handle.name.replace(/\.ncm$/i, '.mp3');
                        const mp3FileHandle = await saveDirHandle.getFileHandle(mp3Filename, { create: true });
                        const writable = await mp3FileHandle.createWritable();
                        await writable.write(mp3Blob.blob);
                        await writable.close();

                        this.files.push({
                            path: file.path,
                            outputName: mp3Filename,
                            status: 'success'
                        });
                    } catch (err) {
                        console.error(`文件处理失败: ${file.path}`, err);
                        this.files.push({
                            path: file.path,
                            error: err.message,
                            status: 'error'
                        });
                    }
                }

                this.statusMessage = `已完成 ${ncmFiles.length} 个NCM文件的解码和保存`;
                this.progress = 100;
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('操作失败:', err);
                    this.hasError = true;
                    this.statusMessage = `错误: ${err.message}`;
                }
            } finally {
                this.isProcessing = false;
            }
        },

        async processDirectory(handle, fileList, path) {
            for await (const entry of handle.values()) {
                if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.ncm')) {
                    fileList.push({
                        handle: entry,
                        path: path ? `${path}/${entry.name}` : entry.name
                    });

                    this.files.push({
                        path: path ? `${path}/${entry.name}` : entry.name,
                        status: 'pending'
                    });
                } else if (entry.kind === 'directory') {
                    await this.processDirectory(entry, fileList, path ? `${path}/${entry.name}` : entry.name);
                }
            }
        }
    }
}
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