---
title: Docker安装与使用
shortTitle: Docker安装与使用
icon: fab fa-markdown
isOriginal: true
date: 2023-12-27
order: 1
category:
  - Docker指南
tag:
  - Docker
---

Docker 的安装和一些常用操作的基本指南

### 安装 Docker

### Docker 的自动化安装

Docker 官方和国内 daocloud 都提供了一键安装的脚本，使得 Docker 的安装更加便捷。

## 官方的一键安装方式：

```bash
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
```

## 国内 daocloud 一键安装命令：

```bash
curl -sSL https://get.daocloud.io/docker | sh
```

### 常用 Docker 操作

以下是一些常用的 Docker 命令，适用于 CentOS 系统。每个命令都附带了简要的解释：

1. **安装 Docker：**

   ```bash
   sudo yum install docker
   ```

   安装 Docker 软件包。

2. **启动 Docker 服务：**

   ```bash
   sudo systemctl start docker
   ```

   启动 Docker 守护进程。

3. **设置 Docker 服务开机启动：**

   ```bash
   sudo systemctl enable docker
   ```

   配置 Docker 服务在系统启动时自动启动。

4. **检查 Docker 版本：**

   ```bash
   docker --version
   ```

   显示已安装的 Docker 版本信息。

5. **拉取 Docker 镜像：**

   ```bash
   docker pull image_name
   ```

   从 Docker Hub 或其他镜像仓库拉取指定的镜像。

6. **列出本地所有镜像：**

   ```bash
   docker images
   ```

   显示本地已经下载的 Docker 镜像列表。

7. **运行容器并进入交互式终端：**

   ```bash
   docker run -it image_name /bin/bash
   ```

   以交互式模式运行一个容器，并打开一个 Bash 终端。

8. **列出正在运行的容器：**

   ```bash
   docker ps
   ```

   显示正在运行的容器列表。

9. **列出所有容器（包括已停止的）：**

   ```bash
   docker ps -a
   ```

   显示所有容器的列表，包括已经停止的。

10. **停止容器：**

    ```bash
    docker stop container_id
    ```

    停止正在运行的容器。

11. **删除容器：**

    ```bash
    docker rm container_id
    ```

    删除已经停止的容器。

12. **查看容器日志：**

    ```bash
    docker logs container_id
    ```

    查看容器的日志输出。

13. **查找 Docker 镜像：**

    ```bash
    docker search search_term
    ```

    在 Docker Hub 上搜索特定关键词的镜像。

14. **构建 Docker 镜像：**

    ```bash
    docker build -t image_name .
    ```

    在当前目录下的 Dockerfile 中构建一个新的镜像。

15. **上传镜像到 Docker Hub（首先需要登录）：**

    ```bash
    docker login
    docker push image_name
    ```

    登录 Docker Hub 并将本地镜像推送到仓库。
