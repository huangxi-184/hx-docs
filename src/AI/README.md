---
title: LangChain学习
shortTitle: LangChain
icon: fab fa-markdown
isOriginal: false
date: 2026-07-07
order: 1
category:
  - LangChain
tag:
  - LangChain
---

# AI 专栏

> AI 相关技术文档

---

# LangChain —— 消息（Message）

消息（Message）是 **LangChain** 中模型上下文（Context）的基本单位。

每条消息主要包含三个部分：

- **Role（角色）**：标识消息类型，例如 `system`、`user`
- **Content（内容）**：消息的实际内容，可以是文本、图片、音频、文档等多模态数据
- **Metadata（元数据）**：可选信息，例如消息 ID、Token 使用量、响应信息等

---

# 最简单的使用方式

通常推荐创建消息对象，然后将消息列表传递给模型。

```python
from langchain.chat_models import init_chat_model
from langchain.messages import (
    HumanMessage,
    AIMessage,
    SystemMessage
)

model = init_chat_model("openai:gpt-5-nano")

system_msg = SystemMessage(
    "You are a helpful assistant."
)

human_msg = HumanMessage(
    "Hello, how are you?"
)

messages = [
    system_msg,
    human_msg
]

response = model.invoke(messages)
```

返回值为：

```python
AIMessage(...)
```

---

# 简单调用（无上下文）

如果只是一次性的文本生成，不需要保留聊天历史，可以直接传入字符串。

```python
response = model.invoke(
    "Write a haiku about spring"
)
```

> **适用场景**
>
> - 文本生成
> - 翻译
> - 总结
> - 改写
> - 不需要多轮对话

---

# 字典格式（OpenAI Chat 格式）

虽然 LangChain 已经封装了 Message 类，但仍然兼容 OpenAI Chat Completion 的消息格式。

```python
messages = [
    {
        "role": "system",
        "content": "You are a poetry expert"
    },
    {
        "role": "user",
        "content": "Write a haiku about spring"
    },
    {
        "role": "assistant",
        "content": "Cherry blossoms bloom..."
    }
]

response = model.invoke(messages)
```

> **说明**
>
> 能用，但一般**不推荐**。
>
> 更推荐使用：
>
> - `SystemMessage`
> - `HumanMessage`
> - `AIMessage`
> - `ToolMessage`

---

# LangChain 消息类型

LangChain 内置了几种常见消息类型。

| 消息类型        | 作用                     |
| --------------- | ------------------------ |
| `SystemMessage` | 系统提示词，定义模型行为 |
| `HumanMessage`  | 用户输入                 |
| `AIMessage`     | AI 返回结果              |
| `ToolMessage`   | 工具调用结果             |

---

# 1. SystemMessage（系统消息）

用于告诉模型：

- 扮演什么角色
- 使用什么语气
- 遵循哪些规则
- 提供哪些上下文

例如：

```python
from langchain.messages import SystemMessage

system_msg = SystemMessage(
    "You are a helpful assistant."
)
```

常见用途：

- 设定 AI 身份
- 输出格式约束
- 指定回复语言
- 安全限制

---

# 2. HumanMessage（用户消息）

表示用户输入。

除了文本，还支持：

- 图片
- 音频
- 文件
- 多模态内容

示例：

```python
from langchain.messages import HumanMessage

human_msg = HumanMessage(
    content="Hello!"
)
```

---

## HumanMessage 元数据

可以携带一些额外信息。

```python
human_msg = HumanMessage(
    content="Hello!",
    name="alice",
    id="msg_123"
)
```

参数说明：

| 参数      | 说明              |
| --------- | ----------------- |
| `content` | 消息内容          |
| `name`    | 可选，用户名称    |
| `id`      | 可选，消息唯一 ID |

---

# 3. AIMessage（AI 消息）

表示模型返回的内容。

除了文本之外，还可能包含：

- Tool Calls
- 多模态输出
- Provider Metadata
- Token 使用情况

例如：

```python
response = model.invoke(messages)

print(response)
```

返回：

```python
AIMessage(...)
```

---

## 手动创建 AIMessage

有时候，并不是所有 AIMessage 都来自模型。

例如：

- 补充聊天历史
- 恢复历史记录
- 模拟 AI 回复

都可以手动创建。

```python
from langchain.messages import (
    AIMessage,
    HumanMessage,
    SystemMessage
)

ai_msg = AIMessage(
    "I'd be happy to help you with that question!"
)

messages = [
    SystemMessage(
        "You are a helpful assistant"
    ),
    HumanMessage(
        "Can you help me?"
    ),
    ai_msg,
    HumanMessage(
        "Great! What's 2+2?"
    )
]

response = model.invoke(messages)
```

这样模型会认为这条 `AIMessage` 就是之前已经回答过的内容。

---

# 4. ToolMessage（工具消息）

用于表示工具调用后的返回结果。

例如：

```text
Human
    ↓
AI 发起 Tool Call
    ↓
Tool 执行
    ↓
ToolMessage 返回结果
    ↓
AI 根据 ToolMessage 继续回答
```

ToolMessage 通常由 Agent 自动生成，一般无需手动创建。

---

# Token 使用情况

LangChain 会将 Token 使用信息保存到：

```python
response.usage_metadata
```

示例：

```python
response = model.invoke("Hello!")

print(response.usage_metadata)
```

可能输出：

```python
{
    "input_tokens": 15,
    "output_tokens": 28,
    "total_tokens": 43
}
```

---

# 总结

```
SystemMessage
        │
        ▼
HumanMessage
        │
        ▼
   Chat Model
        │
        ▼
AIMessage
        │
        ▼
（可选）
Tool Call
        │
        ▼
ToolMessage
        │
        ▼
AIMessage
```

---

## 常见使用场景

| 场景           | 推荐方式                  |
| -------------- | ------------------------- |
| 一次性文本生成 | `model.invoke("...")`     |
| 多轮聊天       | Message 列表              |
| 设置 AI 身份   | `SystemMessage`           |
| 用户输入       | `HumanMessage`            |
| AI 回复        | `AIMessage`               |
| Tool 调用      | `ToolMessage`             |
| 查看 Token     | `response.usage_metadata` |

---

## 推荐实践

✅ 推荐使用 Message 对象：

```python
SystemMessage(...)
HumanMessage(...)
AIMessage(...)
ToolMessage(...)
```

❌ 不推荐直接使用字典格式：

```python
{
    "role": "...",
    "content": "..."
}
```

虽然两种方式都支持，但 Message 类具有更好的：

- 类型提示
- 可读性
- 可维护性
- IDE 自动补全
- 与 LangChain API 深度集成