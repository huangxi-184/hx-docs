---
title: Next Server Actions
shortTitle: Server Actions
icon: fab fa-markdown
date: 2024-06-21
order: 1
category:
  - React
  - Next
tag:
  - Next
---

# 基本用法

定义一个 Server Action 需要使用 React 的 `"use server"` 指令。按指令的定义位置分为两种用法：

1. **函数级别**：将 `"use server"` 放到一个 async 函数的顶部表示该函数为 Server Action。
2. **模块级别**：将 `"use server"` 放到一个单独文件的顶部表示该文件导出的所有函数都是 Server Actions。

Server Actions 可以在服务端组件使用，也可以在客户端组件使用。

- 在服务端组件中使用的时候，两种级别都可以使用。
- 在客户端组件中使用的时候，只支持模块级别。

文件名无约定，很多开发者常命名为 "actions"，在顶部添加 `"use server"` 指令：

```ts
import { create } from '@/app/actions'

export function Button() {
  return (
    // ...
  )
}
```

也可以将 Server Action 作为 props 传给客户端组件：

```tsx
<ClientComponent updateItem={updateItem} />
```

## 示例

### actions.ts

```ts
'use server'

import { revalidatePath } from "next/cache";

const data = ['阅读', '写作', '冥想']

export async function findToDos() {
  return data
}

export async function createToDo(formData) {
  const todo = formData.get('todo')
  data.push(todo)
  revalidatePath("/form2");
  return data
}
```

### page.js

```tsx
// app/form2/page.js
import { findToDos, createToDo } from './actions';

export default async function Page() {
  const todos = await findToDos();
  return (
    <>
      <form action={createToDo}>
        <input type="text" name="todo" />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </>
  )
}
```

### Button Component

```tsx
'use client'

import { createToDoDirectly } from './actions';

export default function Button({children}) {
  return <button onClick={async () => {
    const data = await createToDoDirectly('运动')
    alert(JSON.stringify(data))
  }}>{children}</button>
}
```

## 使用 Server Actions 的好处

- **代码更简洁**：不需要手动创建接口，而且 Server Actions 是函数，可以在应用程序的任意位置复用。
- **支持渐进式增强**：当结合 form 使用时，即使禁用 JavaScript，表单也可以正常提交。

## 注意要点

- **可序列化**：Server Actions 的参数和返回值都必须是可序列化的，即 `JSON.stringify` 这个值不出错。
- **继承配置**：Server Actions 会继承使用的页面或者布局的运行时和路由段配置项，包括像 `maxDuration` 等字段。

虽然 Server Actions 常与 `<form>` 一起使用，但其实还可以在事件处理程序、`useEffect`、三方库、其他表单元素（如 `<button>`）中调用。
useFormStatus,用于返回表单提交的状态信息

```tsx
'use client'
import { useFormStatus } from 'react-dom'
 
export function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button type="submit" aria-disabled={pending}>
      {pending ? 'Adding' : 'Add'}
    </button>
  )
}
```

```tsx
// app/page.jsx
import { SubmitButton } from '@/app/submit-button'
 
export default async function Home() {
  return (
    <form action={...}>
      <input type="text" name="field-name" />
      <SubmitButton />
    </form>
  )
}
```

使用的时候要注意：useFormStatus 必须用在 `<form>` 下的组件内部，就像这段示例代码一样。先建立一个按钮组件，在组件内部调用 useFormStatus，然后 `<form>` 下引用该组件。

```tsx
'use client'

import { useFormState } from 'react-dom'

export default function Home() {

  async function createTodo(prevState, formData) {
    return prevState.concat(formData.get('todo'));
  }

  const [state, formAction] = useFormState(createTodo, [])

  return (
    <form action={formAction}>
      <input type="text" name="todo" />
      <button type="submit">Submit</button>
      <p>{state.join(',')}</p>
    </form>
  ) 
}
```



