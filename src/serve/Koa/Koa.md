---
title: Koa
shortTitle: Koa
icon: fab fa-markdown
date: 2023-10-11
order: 2
category:
  - Koa
tag:
  - Koa
---

app.listen

Koa 应用程序不是 HTTP 服务器的 1 对 1 展现。 可以将一个或多个 Koa 应用程序安装在一起以形成具有单个 HTTP 服务器的更大应用
程序。

这意味着您可以将同一个应用程序同时作为 HTTP 和 HTTPS 或多个地址：

```js
const http = require("http");
const https = require("https");
const Koa = require("koa");
const app = new Koa();
http.createServer(app.callback()).listen(3000);
https.createServer(app.callback()).listen(3001);
```

app.use()

将给定的中间件方法添加到此应用程序。app.use() 返回 this, 因此可以链式表达.

<!-- koa的所有中间件地址 https://github.com/koajs/koa/wiki#middleware -->

```js
app.use(someMiddleware).use(someOtherMiddleware).listen(3000);
//   等于
app.use(someMiddleware);
app.use(someOtherMiddleware);
app.listen(3000);
```

app.context

<!-- 为ctx对象,挂载更多的属性 -->

```js
app.context.db = db();

// 之后就可以直接使用ctx.db了
```

### 错误处理

<!-- 要执行自定义错误处理逻辑，如集中式日志记录 -->

```js 监听全局错误,并执行
app.on("error", (err, ctx) => {
  log.error("server error", err, ctx);
});
```

## 上下文(Context)

Koa Context 将 node 的 request 和 response 对象封装到单个对象中每个请求都将创建一个 Context

```js
app.use(async (ctx) => {
  ctx; // 这是 Context
  ctx.request; // 这是 koa Request
  ctx.response; // 这是 koa Response
});
```

注意绕过 Koa 的 response 处理是 不被支持的. 应避免使用以下 node 属性：

```js
res.statusCode;
res.writeHead();
res.write();
res.end();
```

### ctx.throw([status], [msg], [properties])

抛出对于客户端的错误,根据需要将 properties 对象传递到错误中，对于装载上传给请求者的机器友好的错误是有用的。这用于修饰其
人机友好型错误并向上游的请求者报告非常有用。

```js
ctx.throw(401, "access_denied", { user: user });
```

## Request 别名

以下访问器和 Request 别名等效：

```js
ctx.header;
ctx.headers;
ctx.method;
ctx.method = ctx.url;
ctx.url = ctx.originalUrl;
ctx.origin;
ctx.href;
ctx.path;
ctx.path = ctx.query;
ctx.query = ctx.querystring;
ctx.querystring = ctx.host;
ctx.hostname;
ctx.fresh;
ctx.stale;
ctx.socket;
ctx.protocol;
ctx.secure;
ctx.ip;
ctx.ips;
ctx.subdomains;
ctx.is();
ctx.accepts();
ctx.acceptsEncodings();
ctx.acceptsCharsets();
ctx.acceptsLanguages();
ctx.get();
```

## Response 别名

以下访问器和 Response 别名等效

```js
ctx.body
ctx.body=
ctx.status
ctx.status=
ctx.message
ctx.message=
ctx.length=
ctx.length
ctx.type=
ctx.type
ctx.headerSent
ctx.redirect()
ctx.attachment()
ctx.set()
ctx.append()
ctx.remove()
ctx.lastModified=
ctx.etag=
```

## 请求对象 API

加了 ' = ' 说明是设置修改该对象

```js
// 请求头对象 request.header
// 请求方法 request.method
// 返回以数字返回请求的 Content-Length request.length
// 获取请求 URL request.url
// 获取请求原始URL request.originalUrl(这个是不可以写的,只读的)
// 获取请求 Content-Type request.type

const ct = ctx.request.type;
// => "image/png"

// 获取query参数,request.query.返回一个对象.没有时,返回一个空对象

请求远程地址 request.ip

检查请求是否是幂等的。request.idempotent
返回请求套接字。request.socket
```

## 响应(Response)

```js
// 获取响应状态 response.status
// 响应主体 response.body
// string 写入
// Buffer 写入
// Stream 管道
// Object || Array JSON-字符串化
// null 无内容响应
// 执行 [302] 重定向到 url.
response.redirect(url, [alt]);
```
