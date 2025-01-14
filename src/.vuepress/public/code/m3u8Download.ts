import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';

const m3u8Url = 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8'; // 替换为实际的 m3u8 URL
const outputDir = './output'; // 输出目录
const mergedTsFilePath = path.join(outputDir, 'merged_video.ts'); // 合并后的文件路径
const batchSize = 8;

// 创建输出目录
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadFile(url: string, outputPath: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file from ${url}: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

async function downloadBatch(tsUrls: string[], batchSize: number) {
  for (let i = 0; i < tsUrls.length; i += batchSize) {
    const batch = tsUrls.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (tsUrl) => {
        const tsFileName = path.basename(tsUrl);
        const tsFilePath = path.join(outputDir, tsFileName);
        console.log(`Downloading ${tsUrl} to ${tsFilePath}`);
        await downloadFile(tsUrl, tsFilePath);
      })
    );
  }
}

async function downloadM3U8() {
  try {
    // 下载 m3u8 文件
    const m3u8FilePath = path.join(outputDir, 'video.m3u8');
    await downloadFile(m3u8Url, m3u8FilePath);

    // 读取 m3u8 文件内容
    const m3u8Content = fs.readFileSync(m3u8FilePath, 'utf-8');
    const lines = m3u8Content.split('\n');

    // 提取 TS 文件 URL
    const tsUrls: string[] = [];
    for (const line of lines) {
      if (!line.startsWith('#')) {
        const tsUrl = new URL(line, m3u8Url).href;
        tsUrls.push(tsUrl);
      }
    }

    // 分批下载 TS 文件
    await downloadBatch(tsUrls, batchSize);

    // 合并 TS 文件
    const writeStream = fs.createWriteStream(mergedTsFilePath);
    writeStream.setMaxListeners(20); // 增加最大监听器数量

    for (const tsUrl of tsUrls) {
      const tsFileName = path.basename(tsUrl);
      const tsFilePath = path.join(outputDir, tsFileName);
      const readStream = fs.createReadStream(tsFilePath);
      readStream.pipe(writeStream, { end: false });

      readStream.on('end', () => {
        readStream.close(); // 关闭读取流
        writeStream.write(Buffer.alloc(0)); // 确保写入缓冲区清空
      });

      readStream.on('error', (err) => {
        console.error(`Error reading file ${tsFilePath}:`, err);
      });
    }

    writeStream.end();

    // 等待写入流结束
    await new Promise<void>((resolve) => {
      writeStream.on('finish', () => {
        console.log('All files have been downloaded and merged.');
        resolve();
      });
    });

    // 删除原始 TS 文件
    for (const tsUrl of tsUrls) {
      const tsFilePath = path.join(outputDir, path.basename(tsUrl));
      fs.unlinkSync(tsFilePath);
      console.log(`Deleted ${tsFilePath}`);
    }

    // 删除 m3u8 文件
    fs.unlinkSync(m3u8FilePath);
    console.log(`Deleted ${m3u8FilePath}`);
  } catch (error) {
    console.error('Error downloading or merging files:', error);
  }
}

downloadM3U8();
