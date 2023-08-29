---
title: CentOS8上安装Nginx过程以及常用命令
shortTitle: CentOS安装Nginx
icon: fab fa-markdown
isOriginal: true
date: 2023-08-22
banner: "https://mp-ed71f75c-9da2-4ca3-9001-f3f1d0c8fc63.cdn.bspapp.com/hx-tool/read/keai.gif"
order: 1
category:
  - 使用指南
tag:
  - Nginx
---

要在 CentOS8 上安装 Nginx，可以按照以下步骤进行操作。Nginx 通常安装在`/etc/nginx`目录下。

1. 打开终端，使用 root 或具有管理员权限的用户登录。

2. 更新包管理器的软件包列表：

   ```bash
   sudo yum update
   ```

3. 安装 Nginx 软件包：

   ```bash
   sudo yum install nginx
   ```

   注:若这里报错--仓库 `appstream` 下载元数据失败 : `Cannot prepare internal mirrorlist: No URLs in mirrorlist`
   需要使用下面这两句命令

   ```bash
   sudo sed -i -e "s|mirrorlist=|#mirrorlist=|g" /etc/yum.repos.d/CentOS-*
   sudo sed -i -e "s|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g" /etc/yum.repos.d/CentOS-*
   ```

4. 启动 Nginx 服务并将其设置为开机自启动：

   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

5. 检查 Nginx 服务状态，确保它正在运行：

   ```bash
   sudo systemctl status nginx
   ```

6. 默认情况下，Nginx 的配置文件位于 `/etc/nginx` 目录下。主要的配置文件是 `nginx.conf`。

   ```bash
   sudo nano /etc/nginx/nginx.conf
   ```

   这将使用 `nano` 编辑器打开配置文件。你可以使用其他编辑器，如 `vim` 或 `vi`，根据个人偏好进行选择。

7. 在配置文件中，你可以配置虚拟主机、反向代理、SSL/TLS、缓存等各种设置。完成编辑后，保存文件并关闭编辑器。

8. 重载 Nginx 配置以使更改生效：

   ```bash
   sudo nginx -t     # 检查配置文件语法是否正确
   sudo systemctl reload nginx
   ```

Nginx 在 CentOS 中的一些重要目录：

- 配置文件目录：`/etc/nginx`
- 默认的网站根目录：`/usr/share/nginx/html`
- 日志文件目录：`/var/log/nginx`
- 主要配置文件：`/etc/nginx/nginx.conf`

安装完成后，你可以在默认的网站根目录中放置网页文件，然后通过访问服务器的 IP 地址或域名来查看网页。要进行更高级的配置，可以编辑主要配置文件和虚拟主机配置文件。

请注意，具体安装和配置步骤可能会因操作系统版本的不同而略有差异。在进行任何更改之前，建议你备份现有的配置文件以防止意外情况。

9.开启 https 方式.

上传证书和密钥到服务器上,填写`server_name`,修改`ssl_certificate` `ssl_certificate_key` 字段的路径.重启服务即可.
