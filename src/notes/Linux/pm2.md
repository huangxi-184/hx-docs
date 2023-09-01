---
title: PM2跑Node应用
shortTitle: PM2
icon: fab fa-markdown
date: 2023-09-01
order: 2
category:
  - PM2
  - Node
tag:
  - PM2
  - AI
---

# PM2 进程管理工具

PM2 是一个进程管理工具，用于进程管理、日志管理、负载均衡和性能监控。其命名中的 "2" 表示第二个大版本，与前一个版本有很大的差异。

## 安装

要安装 PM2，可以运行以下命令：

```sh
npm install -g pm2
```

## 日志管理

### 查看日志

通过以下命令可以打印全部日志，可以通过进程 ID 或进程名来区分不同进程的日志：

```sh
pm2 logs
```

### 文件形式查看日志

日志文件存储在目录 `~/.pm2/logs` 中，分别以 `进程名-out.log` 和 `进程名-error.log` 来区分。

### 查看单个进程日志

可以使用以下命令查看特定进程的日志：

```sh
pm2 logs 进程名/进程id
```

## 重启配置

当应用程序的最大内存超过 1GB 时，可以使用以下命令重启应用：

```sh
pm2 start xxx --max-memory-restart 1024M
```

当文件内容发生更改时，可以自动重启软件：

```sh
pm2 start xxx --watch
```

手动重启应用程序：

```sh
pm2 restart xxx
```

## 进程管理

### 查看所有进程

通过以下命令可以查看所有的进程：

```sh
pm2 ls
```

### 删除进程

可以使用以下命令删除特定的进程：

```sh
pm2 delete 进程名/进程id
```

### 清理日志

清理日志的命令如下：

全清：

```sh
pm2 flush
```

根据进程清理：

```sh
pm2 flush 进程名|id
```

### 停止进程

停止特定进程：

```sh
pm2 stop 进程名|id
```

## 多进程管理

可以开启多个进程来运行当前应用程序：

使用 CPU 核心数的进程数：

```sh
pm2 start app.js -i max
pm2 start app.js -i 0
```

动态调整进程数：

```sh
pm2 scale 进程名 进程数
```

## 性能监控

通过以下命令可以查看性能监控信息：

```sh
pm2 monit
```

## 批量执行文件

通过以下步骤可以进行批量执行：

1. 创建配置文件（ecosystem.config.js）：

```sh
pm2 ecosystem
```

2. 配置完成后，批量设置应用：

```sh
pm2 start ecosystem.config.js
```
