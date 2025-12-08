---
title: ragFlow部署模型问题总结
icon: fab fa-markdown
order: 4
category:
  - 部署
tag:
  - 部署
---

# 🚀 AI 部署常见问题与解决方案指南

## 1. Paramiko + Conda 环境指令无法识别

**问题：**
远程 SSH 命令执行时，Conda 环境无法识别。

**解决：使用 Conda 的绝对路径执行环境命令**

```sh
conda_path="/home/hcs2/miniconda3/condabin/conda"
HF_MIRROR="https://hf-mirror.com"

env_vars=(
    "HF_ENDPOINT=$HF_MIRROR"
    "HF_HUB_ENDPOINT=$HF_MIRROR"
)

env_prefix="$(printf "%s " "${env_vars[@]}")"
command_parts=(
    "$conda_path run -n vllm ${env_prefix} vllm serve ${model}"
)
```

---

## 2. HuggingFace 模型下载失败（无网络）

**解决：**
在 Shell 中直接拼接镜像源环境变量，让 vLLM 拉取模型不再访问官方源。

---

## 3. 无法读取远程 Shell 输出

**解决：** 为 `conda run` 添加 `--no-capture-output`

```sh
/home/hcs2/miniconda3/condabin/conda run -n vllm --no-capture-output \
    HF_ENDPOINT=https://hf-mirror.com \
    HF_HUB_ENDPOINT=https://hf-mirror.com \
    vllm serve deepseek-ai/DeepSeek-R1-0528-Qwen3-8B \
    --port 8080 --dtype auto
```

---

## 4. 部署成功但外部无法访问

**原因：防火墙未放行端口**

```sh
sudo ufw allow 8080/tcp
```

**PowerShell 测试：**

```powershell
Test-NetConnection -ComputerName 172.31.20.231 -Port 8080
```

---

## 5. 部署后前端对话页调试

需要解决：

1. 模型部署完成后自动加入系统模型列表
2. 创建对话会话，写入对应模型参数，并拿到 conversationId

---

## 6. Web 页面显示彩色 ANSI 日志

```tsx
import { AnsiUp } from 'ansi_up';
const ansi_up = new AnsiUp();

function deployLogs() {
  return (
    <div
      style={{
        color: '#cbd5e0',
        fontFamily: "'Fira Code', 'Consolas', monospace",
        whiteSpace: 'pre-wrap',
        lineHeight: 1.5,
        height: '600px',
        overflowY: 'auto',
      }}
      dangerouslySetInnerHTML={{
        __html: ansi_up.ansi_to_html(logs.join('')),
      }}
    ></div>
  );
}
```

### 注意事项:
1. 查找端口占用 `lsof -i :8080`
2. 查看显存占用信息 `nvidia-smi`
3. 查找vLLM占用 `ps aux | grep "vllm serve"`
4. task_executor_0 reported heartbeat 30S检查一次


# 🧩 Tmux 会话管理教程

## 3.1 新建会话

当启动 Tmux 时，第一个窗口的编号是 **0**，第二个是 **1**，以此类推。
这些窗口对应的会话编号分别为 **0 号会话、1 号会话**。

然而，使用编号区分会话并不直观，因此我们通常会为会话 **起一个名称**：

```bash
$ tmux new -s <session-name>
```

示例：

```bash
$ tmux new -s myproject
```

> 💡 这样创建的会话名为 `myproject`，方便管理和区分。

---

## 3.2 分离会话

在 Tmux 窗口中，可以按下快捷键 **`Ctrl+b d`** 或执行命令分离当前会话：

```bash
$ tmux detach
```

此操作会 **退出当前 Tmux 窗口**，但会话及其运行的进程仍在后台继续运行。

查看所有会话：

```bash
$ tmux ls
# 或
$ tmux list-session
```

---

## 3.3 接入会话

要重新进入已存在的会话，可以使用：

```bash
# 使用会话编号
$ tmux attach -t 0

# 使用会话名称
$ tmux attach -t <session-name>
```

示例：

```bash
$ tmux attach -t myproject
```

---

## 3.4 杀死会话

要结束某个会话：

```bash
# 使用会话编号
$ tmux kill-session -t 0

# 使用会话名称
$ tmux kill-session -t <session-name>
```

示例：

```bash
$ tmux kill-session -t myproject
```

---

## 3.5 切换会话

当你已经在某个会话中时，可以直接切换到其他会话：

```bash
# 使用会话编号
$ tmux switch -t 0

# 使用会话名称
$ tmux switch -t <session-name>
```

示例：

```bash
$ tmux switch -t backend
```

---

## 3.6 重命名会话

重命名一个会话：

```bash
$ tmux rename-session -t 0 <new-name>
```

示例：

```bash
$ tmux rename-session -t 0 webapi
```

---

## 3.7 会话快捷键速查表

| 快捷键       | 功能说明                         |
| :----------- | :------------------------------- |
| **Ctrl+b d** | 分离当前会话（detach）           |
| **Ctrl+b s** | 列出所有会话（session list）     |
| **Ctrl+b $** | 重命名当前会话（rename session） |

## Git账号信息
username: xi.huang@ustchcs.com

## 🚀 前端打包迁移指令
1. 运行以下命令，将前端项目打包：

```bash
npm run build
```

1. 运行以下命令，将打包后的文件复制到服务器上：

```bash
sudo rm -rf /var/www/html/* && sudo cp -r /home/test/llm-source/xychat-ragflow/web/dist/* /var/www/html/
# 直接打包并与与运行:
sudo npm run build && sudo rm -rf /var/www/html/* && sudo cp -r /home/test/llm-source/xychat-ragflow/web/dist/* /var/www/html/
```

## 🚀 服务器启动指令

以下是项目启动时常用的命令集合：

```bash
# 设置 HuggingFace 镜像源
export HF_ENDPOINT=https://hf-mirror.com

# 启用虚拟环境
source .venv/bin/activate

# 设置 Python 模块搜索路径
export PYTHONPATH=$(pwd)

# 启动后端服务
bash docker/launch_backend_service.sh
```

> ⚙️ 执行以上命令后，后台服务将正常启动。

## 🚀 备份智能体表数据并刷新智能体
```sql
-- 备份对应的表
INSERT INTO user_canvas_version_copy1 SELECT
  *
FROM
  user_canvas_version AS src
WHERE
  NOT EXISTS (SELECT 1 FROM user_canvas_version_copy1 AS dst WHERE dst.id = src.id);
  
-- 备份对应的表
INSERT INTO user_canvas_copy1 SELECT
  *
FROM
  user_canvas AS src
WHERE
  NOT EXISTS (SELECT 1 FROM user_canvas_copy1 AS dst WHERE dst.id = src.id);
  
-- 只保留最新的一条user_canvas_version
DELETE uv
FROM
  user_canvas_version uv
  JOIN user_canvas_version uv2 ON uv.user_canvas_id = uv2.user_canvas_id
  AND uv.update_time < uv2.update_time;
  
-- 刷新操作
-- 1 代码分析-功能解释
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '代码分析-功能解释' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '代码分析-功能解释';
  
-- 2 代码分析-功能理解
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '代码分析-功能理解' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '代码分析-功能理解';
  
-- 3 代码分析-代码注释
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '代码分析-代码注释' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '代码分析-代码注释';
  
-- 4 代码分析-功能分类
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '代码分析-功能分类' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '代码分析-功能分类';
  
-- 5 文本摘要
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '文本摘要' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '文本摘要';
  
-- 6 代码缺陷检测
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '代码缺陷检测' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '代码缺陷检测';
  
-- 7 文本分类
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '文本分类' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '文本分类';
  
-- 8 代码补全
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '代码补全' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '代码补全';
  
-- 9 漏洞检测-成因分析
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '漏洞检测-成因分析' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '漏洞检测-成因分析';
  
-- 10 代码填空
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '代码填空' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '代码填空';
  
-- 11 漏洞检测-位置类型
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '漏洞检测-位置类型' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '漏洞检测-位置类型';
  
-- 12 文章生成
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '文章生成' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '文章生成';
  
-- 13 事件要素抽取
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '事件要素抽取' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '事件要素抽取';
  
-- 14 代码漏洞修复
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '代码漏洞修复' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '代码漏洞修复';
  
-- 15 漏洞领域知识问答
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '漏洞领域知识问答' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '漏洞领域知识问答';
  
-- 16 命名实体识别
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '命名实体识别' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '命名实体识别';
  
-- 17 代码缺陷修复
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '代码缺陷修复' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '代码缺陷修复';
  
-- 18 自由问答
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '自由问答' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '自由问答';
  
-- 19 代码生成
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '代码生成' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '代码生成';
  
-- 20 机器翻译
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '机器翻译' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '机器翻译';
  
-- 21 多轮对话
UPDATE user_canvas AS t
JOIN (SELECT dsl FROM user_canvas WHERE user_id = '87274cdcd3fd11f0a35be9294ac87ac1' AND title = '多轮对话' LIMIT 1) AS src ON 1 = 1
SET t.dsl = src.dsl
WHERE
  t.title = '多轮对话';
  
-- 刷新user_canvas_version
UPDATE user_canvas_version ucv
JOIN user_canvas uc ON ucv.user_canvas_id = uc.id
SET ucv.dsl = uc.dsl
```

# 🚀 前端项目部署指南

## 🧩 1. 安装依赖并构建项目

```bash
npm install
npm run build
```

## ⚙️ 2. 配置 Nginx

编辑并配置 `nginx.conf` 文件（[nginx.conf](/nginx.conf)）。
确认 `root` 指向前端构建产物目录（通常为 `dist`）。
配置完成后，启动 Nginx 即可完成部署。

## 🧹 3. 停止 Nginx 服务

如果需要停止 Nginx，执行以下命令：

```bash
nginx -s stop
```

🧩 Gunicorn 服务配置文档

🚀 启动 Shell 脚本
```sh
# docker/launch_backend_gunicorn.sh
#!/bin/bash
set -e

load_env_file() {
    local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    local env_file="$script_dir/.env"

    if [ -f "$env_file" ]; then
        echo "Loading environment variables from: $env_file"
        set -a
        source "$env_file"
        set +a
    else
        echo "Warning: .env file not found at: $env_file"
    fi
}
load_env_file


export http_proxy=""; export https_proxy=""; export no_proxy=""; export HTTP_PROXY=""; export HTTPS_PROXY=""; export NO_PROXY=""
export PYTHONPATH=$(pwd)

export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/
JEMALLOC_PATH=$(pkg-config --variable=libdir jemalloc)/libjemalloc.so

PY=python3

if [[ -z "$WS" || $WS -lt 1 ]]; then
  WS=1
fi

MAX_RETRIES=5
STOP=false
PIDS=()

export NLTK_DATA="./nltk_data"
cleanup() {
  echo "Termination signal received. Shutting down..."
  STOP=true
  for pid in "${PIDS[@]}"; do
    if kill -0 "$pid" 2>/dev/null; then
      echo "Killing process $pid"
      kill "$pid"
    fi
  done
  exit 0
}

trap cleanup SIGINT SIGTERM


task_exe(){
    local task_id=$1
    local retry_count=0
    while ! $STOP && [ $retry_count -lt $MAX_RETRIES ]; do
        echo "Starting task_executor.py for task $task_id (Attempt $((retry_count+1)))"
        LD_PRELOAD=$JEMALLOC_PATH $PY rag/svr/task_executor.py "$task_id"
        EXIT_CODE=$?
        if [ $EXIT_CODE -eq 0 ]; then
            echo "task_executor.py for task $task_id exited successfully."
            break
        else
            echo "task_executor.py for task $task_id failed with exit code $EXIT_CODE. Retrying..." >&2
            retry_count=$((retry_count + 1))
            sleep 2
        fi
    done
}

for ((i=0;i<WS;i++))
do
  task_exe "$i" &
  PIDS+=($!)
done


echo "Starting Gunicorn server..."

gunicorn -w ${GUNICORN_WORKERS:-1} \
  -k gthread \
  --threads 16 \
  -b 0.0.0.0:${GUNICORN_PORT:-9380} \
  api.wsgi_entry:app \
  --timeout 3600 \
  --log-level warning
  
PIDS+=($!)

wait
```

🧠 WSGI 入口文件
```py
# api/wsgi_entry.py
from rag.utils.redis_conn import RedisDistributedLock
from api.db.init_data import init_web_data
from api.db.db_models import init_database_tables as init_web_db
from api.db.services.document_service import DocumentService
from api.db.runtime_config import RuntimeConfig
from api import settings
from api.apps import app
import uuid
import threading
import time
import logging
from api.utils.log_utils import init_root_logger
from plugin import GlobalPluginManager


def update_progress():
    lock_value = str(uuid.uuid4())
    redis_lock = RedisDistributedLock(
        "update_progress", lock_value=lock_value, timeout=60)
    logging.info(f"update_progress lock_value: {lock_value}")
    while True:
        try:
            if redis_lock.acquire():
                DocumentService.update_progress()
                redis_lock.release()
        except Exception:
            logging.exception("update_progress exception")
        time.sleep(6)


def init_app():
    init_root_logger("ragflow_server")
    settings.init_settings()
    init_web_db()
    init_web_data()
    RuntimeConfig.init_env()
    RuntimeConfig.init_config(
        JOB_SERVER_HOST=settings.HOST_IP, HTTP_PORT=settings.HOST_PORT)
    GlobalPluginManager.load_plugins()
    threading.Thread(target=update_progress, daemon=True).start()
    return app

app = init_app()
```

## 代码阅读

### 1. .github/ 文件夹
项目里的 `.github/` 文件夹是 GitHub 专门保留的目录，用来配置 GitHub 上与仓库相关的自动化、模板和工作流。它不会影响你本地代码的运行，但会影响仓库在 GitHub 上的表现。

### 文件夹常见用途

| 子目录 / 文件            | 功能说明                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| workflows/               | 放置 GitHub Actions 工作流文件。比如自动构建、测试、部署、打包、发布到 DockerHub/NPM 等。 |
|                          | 📄 示例：`.github/workflows/deploy.yml`                                                    |
| ISSUE_TEMPLATE/          | 存放 Issue 模板，让别人提交问题时自动出现固定的格式（比如 bug 描述、复现步骤等）。        |
| PULL_REQUEST_TEMPLATE.md | 定义 Pull Request 模板，指导贡献者如何描述他们的更改。                                    |

### 2. python的调试
```json
// .vscode\launch.json 
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "task_executor",
            "type": "debugpy",
            "request": "attach",
            "connect": {
                "host": "localhost",
                "port": 5678
            },
            "justMyCode": true,
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}",
                    "remoteRoot": "."
                }
            ]
        },
        {
            "name": "ragflow_server",
            "type": "debugpy",
            "request": "attach",
            "connect": {
                "host": "localhost",
                "port": 5679
            },
            "justMyCode": true,
            "pathMappings": [
                {
                    "localRoot": "${workspaceFolder}",
                    "remoteRoot": "."
                }
            ]
        }
    ],
    "compounds": [
        {
            "name": "Debug All",
            "configurations": [
                "task_executor",
                "ragflow_server"
            ]
        }
    ]
}
```

### 3.__file__ 总是指当前模块自身的文件路径，而不是调用它的地方。所以模块被导入时，__file__ 的值就是被导入模块的绝对路径。和导入的地方无关.