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