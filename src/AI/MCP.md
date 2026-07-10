---
title: LangChain学习二
shortTitle: LangChain学习二
icon: fab fa-markdown
isOriginal: false
date: 2026-07-07
order: 1
category:
  - MCP
tag:
  - MCP
---


# 模型上下文协议（MCP）

> **Model Context Protocol（MCP）** 是一种开放协议，用于标准化应用程序向大语言模型（LLM）提供工具（Tools）和上下文（Context）的方式。

LangChain 可以通过 **`langchain-mcp-adapters`** 接入 MCP Server，使 Agent 能够直接调用远程或本地工具。

---

# 目录

- [安装](#安装)
- [传输方式](#传输方式)
- [使用 MCP 工具](#使用-mcp-工具)
- [编写 MCP Server](#编写-mcp-server)
- [有状态 Session](#有状态-session)

---

# 安装

## 安装 MCP Adapter

### pip

```bash
pip install langchain-mcp-adapters
```

### uv

```bash
uv add langchain-mcp-adapters
```

---

# 传输方式

MCP 目前支持三种通信方式。

| Transport       | 使用场景             | 是否推荐      |
| --------------- | -------------------- | ------------- |
| stdio           | 本地工具             | ⭐⭐⭐⭐⭐         |
| Streamable HTTP | 远程服务器、多客户端 | ⭐⭐⭐⭐⭐（推荐） |
| SSE             | 兼容旧版本、实时流   | ⭐⭐            |

---

## 1. stdio

客户端启动 MCP Server 子进程，通过标准输入输出通信。

```
LLM Client
      │
 stdin/stdout
      │
      ▼
MCP Server
```

特点：

- 本地运行
- 无需 HTTP
- 无需端口
- 配置最简单
- 性能最好

适合：

- 文件操作
- Git
- Python
- Shell
- SQLite
- 本地工具

示例：

```python
mcp.run(transport="stdio")
```

---

## 2. Streamable HTTP（推荐）

Server 独立运行，通过 HTTP 提供 MCP 服务。

```
           HTTP

Client ─────────────► MCP Server
```

特点：

- 支持远程部署
- 支持多个客户端
- 支持认证
- 支持 HTTPS
- 支持 Docker
- 支持负载均衡

适合：

- AI 平台
- Docker
- Kubernetes
- 云服务器
- NAS

示例：

```python
mcp.run(transport="streamable-http")
```

---

## 3. SSE（Server-Sent Events）

HTTP 的一种流式通信方式。

```
Client
   │
HTTP
   │
──────────────
Server 持续推送数据
──────────────
```

特点：

- 长连接
- 服务端主动推送
- 主要用于兼容旧版本

一般新项目建议直接使用 **Streamable HTTP**。

---

# 使用 MCP 工具

可以同时连接多个 MCP Server。

```python
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain.agents import create_agent

client = MultiServerMCPClient(
    {
        "math": {
            "transport": "stdio",
            "command": "python",
            "args": ["/path/to/math_server.py"],
        },
        "weather": {
            "transport": "streamable_http",
            "url": "http://localhost:8000/mcp",
        },
    }
)

tools = await client.get_tools()

agent = create_agent(
    "anthropic:claude-sonnet-4-5",
    tools,
)
```

调用：

```python
math_response = await agent.ainvoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "what's (3 + 5) x 12?"
            }
        ]
    }
)

weather_response = await agent.ainvoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "what is the weather in nyc?"
            }
        ]
    }
)
```

---

## MultiServerMCPClient 默认行为

默认 **无状态（Stateless）**。

每次工具调用都会：

```
创建 ClientSession
        │
调用工具
        │
关闭 Session
```

因此：

- 每次调用都是新的连接
- 工具之间不会共享状态

---

# 编写 MCP Server

安装 MCP：

```bash
pip install mcp
```

或

```bash
uv add mcp
```

---

## 示例一：Math Server（stdio）

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Math")


@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers"""
    return a + b


@mcp.tool()
def multiply(a: int, b: int) -> int:
    """Multiply two numbers"""
    return a * b


if __name__ == "__main__":
    mcp.run(transport="stdio")
```

---

## 示例二：Weather Server（HTTP）

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Weather")


@mcp.tool()
async def get_weather(location: str) -> str:
    """Get weather for location."""
    return "It's always sunny in New York"


if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

---

# 有状态 Session

如果 MCP Server 需要保存上下文（例如数据库连接、登录状态、缓存等），可以创建持久 Session。

```python
from langchain_mcp_adapters.tools import load_mcp_tools

client = MultiServerMCPClient({...})

async with client.session("math") as session:
    tools = await load_mcp_tools(session)
```

工作流程：

```
创建 Session
      │
Tool A
      │
Tool B
      │
Tool C
      │
关闭 Session
```

优点：

- 保持登录状态
- 保持数据库连接
- 保持缓存
- 保持上下文

适合：

- 浏览器自动化
- 数据库事务
- SSH
- 长连接服务

---

# 总结

| 类型            | 推荐场景                   |
| --------------- | -------------------------- |
| stdio           | 本地开发、本地工具         |
| Streamable HTTP | 云端部署、多人共享（推荐） |
| SSE             | 兼容旧版本                 |

---

## 推荐方案

### 本地开发

```
Cursor
    │
stdio
    │
MCP Server
```

---

### 远程部署（推荐）

```
                HTTP

Claude Desktop
Cursor
ChatGPT
VS Code
      │
      ▼
MCP Server（Docker）
      │
      ▼
Tools
```

---

## MCP 架构

```
                 LLM

                  │

             Tool Calling

                  │

          ┌─────────────────┐
          │  MCP Client      │
          └─────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
stdio        HTTP Server      HTTP Server
    │             │             │
Math Tool    Browser Tool    Weather Tool
```