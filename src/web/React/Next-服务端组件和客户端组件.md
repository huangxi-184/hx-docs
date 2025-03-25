---
title: Next-服务端组件和客户端组件
shortTitle: 服务端组件和客户端组件
icon: fab fa-markdown
date: 2024-06-21
order: 2
category:
  - Next
tag:
  - Next
---


## 服务端组件

在 Next.js 中，组件默认就是服务端组件。

```tsx
export default async function Page() {
  const res = await fetch('https://jsonplaceholder.typicode.com/todos')
  const data = (await res.json()).slice(0, 10)
  console.log(data)
  return <ul>
    {data.map(({ title, id }) => {
      return <li key={id}>{title}</li>
    })}
  </ul>
}
```

### 服务端渲染的好处

- **数据获取**：通常服务端环境（网络、性能等）更好，离数据源更近，在服务端获取数据会更快。通过减少数据加载时间以及客户端发出的请求数量来提高性能。
- **安全**：在服务端保留敏感数据和逻辑，不用担心暴露给客户端。
- **缓存**：服务端渲染的结果可以在后续的请求中复用，提高性能。
- **bundle 大小**：服务端组件的代码不会打包到 bundle 中，减少了 bundle 包的大小。
- **初始页面加载和 FCP**：服务端渲染生成 HTML，快速展示 UI。
- **Streaming**：服务端组件可以将渲染工作拆分为 chunks，并在准备就绪时将它们流式传输到客户端。用户可以更早看到页面的部分内容，而不必等待整个页面渲染完毕。

> **在实际项目开发的时候，能使用服务端组件就尽可能使用服务端组件。**

### 服务端组件的限制

- 不能使用 `useState` 管理状态。
- 不能使用浏览器的 API 等。

## 客户端组件

需要在文件顶部添加一个 `"use client"` 声明。

### 使用场景对比

| 场景                                                                 | 服务端组件 | 客户端组件 |
| -------------------------------------------------------------------- | ---------- | ---------- |
| 获取数据                                                             | ✅          | ❌          |
| 访问后端资源（直接）                                                 | ✅          | ❌          |
| 在服务端上保留敏感信息（访问令牌、API 密钥等）                       | ✅          | ❌          |
| 在服务端使用依赖包，从而减少客户端 JavaScript 大小                   | ✅          | ❌          |
| 添加交互和事件侦听器（`onClick()`, `onChange()` 等）                 | ❌          | ✅          |
| 使用状态和生命周期（`useState()`, `useReducer()`, `useEffect()` 等） | ❌          | ✅          |
| 使用仅限浏览器的 API                                                 | ❌          | ✅          |
| 使用依赖于状态、效果或仅限浏览器的 API 的自定义 hook                 | ❌          | ✅          |
| 使用 React 类组件                                                    | ❌          | ✅          |


要将 Next.js 应用程序部署为 HTTPS 方式，通常需要以下步骤。HTTPS 是通过 SSL/TLS 证书实现的，因此你需要获取并配置证书。以下是常见的部署方式：

---

### 1. **使用 Vercel 部署（推荐）**
Vercel 是 Next.js 的官方托管平台，支持自动 HTTPS 配置。

#### 步骤：
1. **将代码推送到 GitHub/GitLab/Bitbucket 等代码仓库**。
2. **登录 Vercel**（如果没有账号，先注册）。
3. **导入项目**：
   - 在 Vercel 控制台中，点击 "New Project"，选择你的代码仓库。
4. **自动配置 HTTPS**：
   - Vercel 会自动为你的域名配置 HTTPS，并颁发免费的 SSL 证书（通过 Let's Encrypt）。
5. **绑定自定义域名（可选）**：
   - 如果你有自己的域名，可以在 Vercel 中绑定，Vercel 会自动为你的域名配置 HTTPS。

---

### 2. **使用自定义服务器部署（如 Nginx）**
如果你在自己的服务器上部署 Next.js 应用，可以通过 Nginx 配置 HTTPS。

#### 步骤：
1. **获取 SSL 证书**：
   - 使用 [Let's Encrypt](https://letsencrypt.org/) 免费获取 SSL 证书。
   - 安装 Certbot 工具：
     ```bash
     sudo apt install certbot python3-certbot-nginx
     ```
   - 为你的域名申请证书：
     ```bash
     sudo certbot --nginx -d yourdomain.com
     ```
   - Certbot 会自动配置 Nginx 并启用 HTTPS。

2. **配置 Nginx**：
   - 编辑 Nginx 配置文件（通常位于 `/etc/nginx/sites-available/default`）：
     ```nginx
     server {
         listen 80;
         server_name yourdomain.com;
         return 301 https://$host$request_uri;
     }

     server {
         listen 443 ssl;
         server_name yourdomain.com;

         ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
         ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

         location / {
             proxy_pass http://localhost:3000; # 将请求转发到 Next.js 应用
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
         }
     }
     ```
   - 重启 Nginx：
     ```bash
     sudo systemctl restart nginx
     ```

3. **运行 Next.js 应用**：
   - 在服务器上启动 Next.js 应用：
     ```bash
     npm run build
     npm run start
     ```

---

### 3. **使用 Docker 部署**
如果你使用 Docker 部署 Next.js 应用，可以在 Docker 容器中配置 HTTPS。

#### 步骤：
1. **获取 SSL 证书**：
   - 使用 Let's Encrypt 获取证书，或者将证书文件挂载到容器中。
2. **配置 Dockerfile**：
   - 在 Dockerfile 中安装 Nginx 并配置 HTTPS。
3. **使用 Docker Compose**：
   - 在 `docker-compose.yml` 中配置 Nginx 和 Next.js 服务。

---

### 4. **使用云服务商（如 AWS、GCP、Azure）**
大多数云服务商（如 AWS、GCP、Azure）都提供了自动 HTTPS 配置的功能。

#### 以 AWS 为例：
1. **部署到 EC2**：
   - 使用 Nginx 或 Apache 配置 HTTPS。
2. **使用 AWS Elastic Beanstalk**：
   - 在 Elastic Beanstalk 中配置负载均衡器并启用 HTTPS。
3. **使用 AWS Amplify**：
   - 类似于 Vercel，Amplify 支持自动 HTTPS 配置。

---

### 5. **本地开发 HTTPS**
如果你需要在本地开发环境中测试 HTTPS，可以使用以下工具：
- **mkcert**：生成本地可信的 SSL 证书。
- **Next.js 内置 HTTPS**：
  - 在 `next.config.js` 中启用 HTTPS：
    ```javascript
    module.exports = {
        server: {
            https: {
                key: fs.readFileSync('path/to/private-key.pem'),
                cert: fs.readFileSync('path/to/certificate.pem'),
            },
        },
    };
    ```

---

### 总结
- **推荐使用 Vercel**：最简单、最快速的方式，自动配置 HTTPS。
- **自定义服务器**：适合需要完全控制部署环境的场景，使用 Nginx 配置 HTTPS。
- **云服务商**：适合企业级应用，提供高可用性和自动扩展。

根据你的需求选择合适的部署方式！