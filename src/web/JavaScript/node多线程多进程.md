---
title: 多线程、多进程详解
shortTitle: 多线程、多进程
icon: fab fa-markdown
date: 2023-09-28
order: 100
category:
  - 多线程、多进程
tag:
  - 多线程、多进程
---

1. 在你的项目根目录创建一个 `package.json` 文件，并确保其中包含 `"type": "module"`：
    ```json
    {
      "type": "module"
    }
    ```

2. 使用 `.mjs` 扩展名来命名你的模块文件。

### 多线程示例

Node.js 提供了 `worker_threads` 模块来实现多线程。下面是一个简单的多线程示例：

**main.mjs**
```js
import { Worker, isMainThread, parentPort } from 'worker_threads';

if (isMainThread) {
  // 这是主线程
  const worker = new Worker(new URL('./worker.mjs', import.meta.url));
  worker.on('message', (message) => {
    console.log(`从工作线程接收到消息: ${message}`);
  });
  worker.on('error', (error) => {
    console.error(`工作线程出错: ${error}`);
  });
  worker.on('exit', (code) => {
    console.log(`工作线程退出，退出码: ${code}`);
  });
} else {
  // 这是工作线程
  parentPort.postMessage('Hello from worker thread!');
}
```

**worker.mjs**
```js
import { parentPort } from 'worker_threads';

parentPort.postMessage('Hello from worker thread!');
```

### 多进程示例

Node.js 提供了 `child_process` 模块来实现多进程。下面是一个简单的多进程示例：

**main.mjs**
```js
import { fork } from 'child_process';

const child = fork(new URL('./child.mjs', import.meta.url));
child.on('message', (message) => {
  console.log(`从子进程接收到消息: ${message}`);
});
child.on('error', (error) => {
  console.error(`子进程出错: ${error}`);
});
child.on('exit', (code) => {
  console.log(`子进程退出，退出码: ${code}`);
});
```

**child.mjs**
```js
process.send('Hello from child process!');
```

`child_process` 和 `worker_threads` 都是 Node.js 提供的用于并发处理的工具，但它们适用于不同的场景。下面是它们各自的特点以及适用场景的详细对比。

### `child_process`

#### 特点：
1. **独立进程**：
    - 每个子进程有自己的独立内存空间和资源。
    - 子进程之间完全隔离，通过 IPC（进程间通信）进行通信。
  
2. **运行独立的 Node.js 脚本**：
    - 子进程可以运行独立的 Node.js 脚本或执行 shell 命令。
  
3. **系统资源开销较大**：
    - 每个子进程都有自己的内存和资源开销，相比线程而言系统资源开销较大。

4. **跨平台兼容性好**：
    - 适用于所有支持 Node.js 的平台，不受操作系统限制。

#### 适用场景：
1. **运行独立的 Node.js 脚本**：
    - 当需要运行独立的 Node.js 脚本时，`child_process` 是一个很好的选择。

2. **执行系统命令**：
    - 当需要执行系统命令或运行外部程序时，可以使用 `child_process`。

3. **高隔离需求**：
    - 当需要高隔离度的任务时，可以使用子进程，避免共享内存带来的数据竞争问题。

#### 示例：

**main.mjs**
```js
import { fork } from 'child_process';

const child = fork(new URL('./child.mjs', import.meta.url));
child.on('message', (message) => {
  console.log(`从子进程接收到消息: ${message}`);
});
child.on('error', (error) => {
  console.error(`子进程出错: ${error}`);
});
child.on('exit', (code) => {
  console.log(`子进程退出，退出码: ${code}`);
});
```

**child.mjs**
```js
process.send('Hello from child process!');
```

### `worker_threads`

#### 特点：
1. **轻量级线程**：
    - 线程比进程更轻量级，系统资源开销较小。
  
2. **共享内存**：
    - 线程可以通过 `SharedArrayBuffer` 共享内存，实现高效的数据传递。
  
3. **与主线程共享资源**：
    - 线程与主线程共享同一个内存空间，可以访问相同的资源。
  
4. **JavaScript 环境**：
    - 适用于在同一个 Node.js 环境中并发执行任务。

#### 适用场景：
1. **CPU 密集型任务**：
    - 当需要并发执行 CPU 密集型任务时，`worker_threads` 是一个很好的选择。
  
2. **共享内存需求**：
    - 当需要高效地共享大量数据时，可以使用 `SharedArrayBuffer` 来共享内存。

3. **较低资源开销需求**：
    - 线程的资源开销较低，适合创建大量并发任务。

#### 示例：
**main.mjs 拉满线程数量** 
```js
// 拉满线程数量
import { Worker } from 'worker_threads';
import { createReadStream, statSync } from 'fs';
import { createHash } from 'crypto';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { cpus } from 'os';

const pipelineAsync = promisify(pipeline);
const CHUNK_SIZE = 1024 * 1024; // 1MB
const NUM_WORKERS = cpus().length; // 使用CPU核心数作为工作线程数

async function computeFileHash(filePath) {
  console.time('计算哈希值');
  console.log(`NUM_WORKERS`, NUM_WORKERS);
  return new Promise((resolve, reject) => {
    const fileHash = createHash('sha256');
    const workers = [];
    let pendingChunks = 0;

    for (let i = 0; i < NUM_WORKERS; i++) {
      const worker = new Worker(new URL('./worker.mjs', import.meta.url));
      workers.push(worker);

      worker.on('message', (hash) => {
        fileHash.update(hash);
        pendingChunks--;
        if (pendingChunks === 0) {
          for (const w of workers) w.terminate();
          resolve(fileHash.digest('hex'));
        }
      });

      worker.on('error', (error) => {
        reject(error);
      });
    }

    const readStream = createReadStream(filePath, { highWaterMark: CHUNK_SIZE });
    let workerIndex = 0;

    pipelineAsync(readStream, async function* (source) {
      for await (const chunk of source) {
        pendingChunks++;
        workers[workerIndex].postMessage(chunk);
        workerIndex = (workerIndex + 1) % NUM_WORKERS;
      }
      // 发送 null 表示结束
      for (const worker of workers) {
        worker.postMessage(null);
      }
    }).catch(reject);
  });
}

const filePath = 'C:\\Users\\DELL\\Desktop\\文件\\230519东富龙30周年产品集锦.mp4';

computeFileHash(filePath)
  .then((hash) => {
    console.log(`文件哈希值: ${hash}`);
    console.timeEnd('计算哈希值');
  })
  .catch((err) => {
    console.error(`计算哈希值时出错: ${err}`);
  });

```


**main.mjs**
```js
import { Worker } from 'worker_threads';
import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import { promisify } from 'util';
import { pipeline } from 'stream';

const pipelineAsync = promisify(pipeline);
const CHUNK_SIZE = 1024 * 1024; // 1MB

async function computeFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.mjs', import.meta.url));
    let fileHash = createHash('sha256');

    worker.on('message', (hash) => {
      fileHash.update(hash);
    });

    worker.on('error', (error) => {
      reject(error);
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`工作线程退出，退出码: ${code}`));
      } else {
        resolve(fileHash.digest('hex'));
      }
    });

    const readStream = createReadStream(filePath, { highWaterMark: CHUNK_SIZE });
    pipelineAsync(readStream, async function* (source) {
      for await (const chunk of source) {
        worker.postMessage(chunk);
      }
      worker.postMessage(null); // 发送 null 表示结束
    }).catch(reject);
  });
}

const filePath = './example.txt';

computeFileHash(filePath)
  .then(hash => {
    console.log(`文件哈希值: ${hash}`);
  })
  .catch(err => {
    console.error(`计算哈希值时出错: ${err}`);
  });

```

**worker.mjs**
```js
import { parentPort } from 'worker_threads';
import { createHash } from 'crypto';

parentPort.on('message', (chunk) => {
  if (chunk === null) {
    parentPort.close(); // 接收到 null 表示结束
  } else {
    const hash = createHash('sha256').update(chunk).digest();
    parentPort.postMessage(hash);
  }
});

```

### 总结

- 使用 `child_process`：
  - 需要运行独立的 Node.js 脚本或外部程序。
  - 需要高度隔离的任务。
  - 需要执行系统命令。
  - 对系统资源开销不敏感。

- 使用 `worker_threads`：
  - 需要并发执行 CPU 密集型任务。
  - 需要高效共享大量数据。
  - 需要较低的系统资源开销。
  - 在同一个 Node.js 环境中并发执行任务。

根据具体需求选择合适的工具，可以提高应用程序的性能和效率。