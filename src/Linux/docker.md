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

Docker 的安装和一些常用操作的基本指南，适用于 CentOS 系统。

## 安装 Docker

### 一键脚本安装

Docker 官方和国内 daocloud 都提供了一键安装脚本，使得安装更加便捷：

```bash
# 官方脚本（--mirror Aliyun 使用阿里云镜像加速安装）
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

# 国内 daocloud 脚本
curl -sSL https://get.daocloud.io/docker | sh
```

::: warning
daocloud 的脚本已较少维护，优先使用官方脚本。
:::

### 手动安装（yum 源）

```bash
# 安装 yum 工具，添加 Docker 官方源
# （国内网络可将仓库地址换为阿里云镜像：https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo）
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 Docker 相关组件
sudo yum install docker-ce docker-ce-cli containerd.io

# 启动并设置开机自启
sudo systemctl start docker
sudo systemctl enable docker
```

::: tip
CentOS8 手动安装时，`yum install docker` 安装的版本较旧且可能报错，推荐通过上面的官方 `docker-ce` 源安装。
:::

### 验证安装

```bash
docker --version      # 显示已安装的 Docker 版本信息
docker run hello-world   # 运行测试镜像，能正常输出说明安装成功
```

## 配置镜像加速

国内环境拉取 Docker Hub 镜像较慢或超时时，可以配置镜像加速器。编辑 `/etc/docker/daemon.json`（没有则新建）：

```json
{
  "registry-mirrors": [
    "https://docker.m.daocloud.io",
    "https://docker.xuanyuan.me"
  ]
}
```

配置多个地址时，Docker 会依次尝试、自动回退。然后重载配置并重启 Docker 生效：

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

验证是否生效：

```bash
docker info | grep -A 3 "Registry Mirrors"
```

::: tip
- 公共加速地址时效性很强，随时可能失效（以上地址确认可用时间为 2026-11）。失效后可搜索「Docker 国内镜像源」获取最新可用列表。
- 腾讯云服务器可直接使用内网加速地址 `https://mirror.ccs.tencentyun.com`，速度快且仅限腾讯云内网使用。
:::

## 免 sudo 使用 Docker

默认只有 root 和 `docker` 组的用户才能操作 Docker。把当前用户加入 `docker` 组，之后就不需要每次都 `sudo` 了：

```bash
sudo groupadd docker            # 创建 docker 组（组已存在时会报同名组错误，忽略即可）
sudo usermod -aG docker $USER   # 把当前用户加入 docker 组
```

然后**重新登录终端**（或执行 `newgrp docker`）使组权限生效：

```bash
docker ps    # 不带 sudo 能正常输出列表，说明配置成功
```

::: warning
`docker` 组的权限等价于 root（可以通过挂载宿主机文件系统获得全部读写权限），只建议在自己的开发机上这样配置。
:::

## 常用命令

### 镜像操作

```bash
docker pull image_name         # 从 Docker Hub 或其他镜像仓库拉取指定镜像
docker images                  # 列出本地已下载的镜像
docker search search_term      # 在 Docker Hub 上搜索特定关键词的镜像
docker build -t image_name .   # 根据当前目录下的 Dockerfile 构建镜像
docker push image_name         # 推送镜像到仓库（需要先 docker login 登录）
docker rmi image_name          # 删除本地镜像
```

### 容器操作

```bash
docker ps                               # 列出正在运行的容器
docker ps -a                            # 列出所有容器（包括已停止的）
docker run [Options] image              # 用镜像创建并运行容器
docker stop container_id                # 停止正在运行的容器
docker rm container_id                  # 删除已停止的容器
docker logs container_id                # 查看容器的日志输出
docker exec -it container_id /bin/bash  # 进入正在运行的容器
```

### docker run 参数说明

| 参数 | 说明 |
| --- | --- |
| `--name="名字"` | 指定容器名字 |
| `-d` | 后台方式运行 |
| `-it` | 使用交互方式运行，进入容器查看内容 |
| `-p 主机端口:容器端口` | 端口映射（常用），也可写 `-p ip:主机端口:容器端口` 或 `-p 容器端口` |
| `-P` | 随机指定端口 |
| `-e` | 设置环境变量 |
| `-v` | 挂载容器数据卷 |

完整示例：

```bash
# 后台启动一个 nginx，命名并做端口映射，然后进入容器查看
docker run -d -p 80:80 --name mynginx nginx
docker exec -it mynginx /bin/bash
```
