---
title: Python 生产环境部署
icon: fab fa-markdown
order: 7
category:
  - gunicorn WSGI
tag:
  - gunicorn WSGI
---

# Gunicorn 使用说明

Gunicorn 是一个纯 Python 的 **WSGI 服务器**，具有以下特点：

- 简单的配置和使用
- 支持多种 worker 类型，可用于性能调优
- **不支持 Windows**，但可以在 **WSL** 上运行

---

## 常用命令示例

```bash
# 启动 Gunicorn
gunicorn --bind 0.0.0.0:5000 -w 4 app:app
````

参数说明：

* `--bind 0.0.0.0:5000`：绑定 IP 地址和端口（0.0.0.0 表示监听所有网卡）
* `-w 4`：启动 4 个 worker 进程
* `app:app`：`app.py` 文件中的 `app` 对象

---

## 示例日志

```log
[2025-10-16 17:07:34 +0800] [429054] [INFO] Starting gunicorn 23.0.0
[2025-10-16 17:07:34 +0800] [429054] [INFO] Listening at: http://0.0.0.0:5000 (429054)
[2025-10-16 17:07:34 +0800] [429054] [INFO] Using worker: sync
[2025-10-16 17:07:34 +0800] [429055] [INFO] Booting worker with pid: 429055
[2025-10-16 17:07:34 +0800] [429056] [INFO] Booting worker with pid: 429056
[2025-10-16 17:07:34 +0800] [429057] [INFO] Booting worker with pid: 429057
[2025-10-16 17:07:34 +0800] [429058] [INFO] Booting worker with pid: 429058
```

日志说明：

* `Starting gunicorn 23.0.0`：Gunicorn 启动
* `Listening at: http://0.0.0.0:5000`：监听的地址和端口
* `Using worker: sync`：使用的 worker 类型
* `Booting worker with pid`：各 worker 进程启动

---

## 生产环境推荐配置

| 配置项                | 推荐值                                                                              | 说明                            |
| ------------------ | -------------------------------------------------------------------------------- | ----------------------------- |
| Worker 类型          | `gunicorn.workers.ggevent.GeventWorker` 或 `sync`/`uvicorn.workers.UvicornWorker` | 根据应用类型选择异步或同步                 |
| Worker 数量          | `(2 x CPU 核心数) + 1`                                                              | 可根据负载调节                       |
| 超时时间 (`--timeout`) | `30-60s`                                                                         | 防止 worker 长时间阻塞               |
| 日志                 | `--access-logfile` 和 `--error-logfile`                                           | 分离访问日志和错误日志                   |
| 绑定地址               | `0.0.0.0:端口`                                                                     | 公网访问需 0.0.0.0，内网可绑定 127.0.0.1 |
| 守护进程               | `--daemon`                                                                       | 生产环境可后台运行                     |
| 预加载应用              | `--preload`                                                                      | 减少 worker 启动时间，适合无状态应用        |

示例启动命令（生产环境）：

```bash
gunicorn --bind 0.0.0.0:5000 -w 8 --timeout 60 \
--access-logfile /var/log/gunicorn/access.log \
--error-logfile /var/log/gunicorn/error.log \
--preload app:app
```

---

> ✅ 提示：
>
> * 在 Windows 上使用生产环境 Gunicorn 不被支持，可通过 **WSL** 或 **Docker** 运行。
> * 对高并发应用，可考虑使用 **异步 worker**（如 `gevent`）。
