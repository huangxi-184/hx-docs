---
title: FastAPI
shortTitle: FastAPI
icon: fab fa-markdown
isOriginal: false
date: 2026-07-07
order: 79
category:
  - FastAPI
tag:
  - FastAPI
---

FastAPI 是一个现代、快速（高性能）的 Web 框架，用于基于标准 Python 类型提示构建 API。

快速启动
创建并激活一个 虚拟环境，然后安装 FastAPI
pip install "fastapi[standard]"

创建一个文件 main.py：
```py
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

