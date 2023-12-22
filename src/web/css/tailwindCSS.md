---
title: tailwindCSS
shortTitle: tailwind
icon: fab fa-markdown
date: 2023-10-09
order: 3
category:
  - CSS
tag:
  - 原子化CSS
---

## vite(vue)搭配 tailwindCSS 安装方式

1.  安装依赖

```sh
    pnpm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
```

执行后,会自动生成`tailwind.config.js`和`postcss.config.js`配置文件.

2. 配置模板路径(`tailwind.config.js`)

```ts
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {}
  },
  plugins: []
};
```

3. 新建一个 css 文件,添加 Tailwind directives.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. 将 css 文件引入到`main.js`,`main.ts`中.

```ts
import "./style/index.css";
```

以上即可完成 tailwindCSS 的安装.可以搭配 vscode 的`Tailwind CSS IntelliSense`插件使用,做到智能提示.

以及配合`prettier`的一个插件,按照推荐格式整理类名,方便阅读.

```sh
pnpm install -D prettier prettier-plugin-tailwindcss
```

```ts
//prettier.config.js
module.exports = {
  plugins: ["prettier-plugin-tailwindcss"]
};
```

## 正式使用

1. 处理悬停、焦点和其他状态

悬停时使用的伪类是`hover`，焦点时使用的伪类是`focus`，以及`active`。

```html
<button class="bg-sky-500 hover:bg-sky-700 ...">Save changes</button>
```
在需要悬停时使用类前加上`hover:`标记
