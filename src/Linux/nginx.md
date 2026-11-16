---
title: CentOS8上安装Nginx过程以及常用命令
shortTitle: CentOS安装Nginx
icon: fab fa-markdown
isOriginal: true
date: 2023-08-22
order: 1
category:
  - 使用指南
tag:
  - Nginx
---

在 CentOS8 上安装 Nginx 的完整过程、常用命令以及 HTTPS、反向代理的配置。Nginx 通常安装在 `/etc/nginx` 目录下。

## 安装步骤

1. 打开终端，使用 root 或具有管理员权限的用户登录。

2. 更新包管理器的软件包列表：

   ```bash
   sudo yum update
   ```

3. 安装 Nginx 软件包：

   ```bash
   sudo yum install nginx
   ```

   ::: warning
   如果这一步报错：

   > 仓库 `appstream` 下载元数据失败 : `Cannot prepare internal mirrorlist: No URLs in mirrorlist`

   原因是 CentOS8 已于 2021 年底停止维护，官方源被迁移到了 vault.centos.org，需要把 yum 源指向新的地址：

   ```bash
   sudo sed -i -e "s|mirrorlist=|#mirrorlist=|g" /etc/yum.repos.d/CentOS-*
   sudo sed -i -e "s|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g" /etc/yum.repos.d/CentOS-*
   ```

   改完再重新执行 `yum install` 即可。
   :::

4. 启动 Nginx 服务并将其设置为开机自启动：

   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

5. 检查 Nginx 服务状态，确保它正在运行：

   ```bash
   sudo systemctl status nginx
   ```

## 重要目录

安装完成后，Nginx 相关的文件分布在以下几个目录：

| 目录 / 文件 | 说明 |
| --- | --- |
| `/etc/nginx` | 配置文件目录 |
| `/etc/nginx/nginx.conf` | 主要配置文件 |
| `/usr/share/nginx/html` | 默认的网站根目录 |
| `/var/log/nginx` | 日志文件目录（`access.log` / `error.log`） |

把网页文件放进默认根目录，就可以通过服务器的 IP 地址或域名来访问了。

## 常用命令

```bash
# --- 服务管理（systemctl） ---
sudo systemctl start nginx      # 启动
sudo systemctl stop nginx       # 停止
sudo systemctl restart nginx    # 重启（会断开现有连接）
sudo systemctl reload nginx     # 重载配置（不断开连接，改完配置优先用它）
sudo systemctl status nginx     # 查看运行状态
sudo systemctl enable nginx     # 设置开机自启

# --- Nginx 自带命令 ---
nginx -v            # 查看版本
nginx -t            # 检查配置文件语法是否正确（改配置后先跑这个）
nginx -s reload     # 重新加载配置，等价于 systemctl reload nginx
nginx -s stop       # 快速停止
nginx -s quit       # 优雅停止（处理完当前请求再退出）
```

::: tip
日常改配置的标准流程：`nginx -t` 检查语法 → `systemctl reload nginx` 平滑生效。
:::

## 修改配置

默认情况下，主要的配置文件是 `/etc/nginx/nginx.conf`，可以直接编辑：

```bash
sudo nano /etc/nginx/nginx.conf
```

这里使用的是 `nano` 编辑器，也可以换成 `vim` 或 `vi`，根据个人偏好选择。在配置文件中可以配置虚拟主机、反向代理、SSL/TLS、缓存等各种设置。

::: warning
具体配置可能因系统版本不同而略有差异。**在做任何更改之前，建议先备份现有的配置文件**，例如：

```bash
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
```
:::

## 开启 HTTPS

1. 把证书和私钥上传到服务器上，例如放到 `/etc/nginx/ssl/` 目录。
2. 在 `server` 块中填写 `server_name`，并指定证书路径：

   ```nginx
   server {
       listen       443 ssl;
       server_name  huangxi.cc;                      # 你的域名

       ssl_certificate      /etc/nginx/ssl/xxx.pem;  # 证书路径
       ssl_certificate_key  /etc/nginx/ssl/xxx.key;  # 私钥路径
   }
   ```

3. 记得在防火墙 / 安全组中放行 443 端口，然后重载配置即可：

   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

## 反向代理示例

::: tip 正向代理 vs 反向代理
从用户的角度看，方向一致的就是正向，反过来就是反向。下面这种「请求打到自己域名，由 Nginx 转发给上游接口」的写法属于**反向代理**（正向代理是代理客户端去访问服务端）。
:::

例如，将 `https://huangxi.cc/tianyancha/` 的请求全部转发到 `https://open.api.tianyancha.com`：

```nginx
location /tianyancha/ {
    rewrite ^/tianyancha/(.*)$ /services/open/$1 break;   # 去掉前缀并改写成上游的真实路径
    proxy_pass https://open.api.tianyancha.com;
    proxy_set_header Host open.api.tianyancha.com;        # 告诉上游访问的是哪个域名
    proxy_set_header X-Real-IP $remote_addr;              # 透传客户端真实 IP
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;           # 透传原始协议（http/https）
    proxy_set_header Authorization "xxxxxx鉴权token";     # 上游接口的鉴权 token
}
```

改完执行 `nginx -t` 检查语法，再 `systemctl reload nginx` 生效。
