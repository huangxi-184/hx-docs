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

好的，以下是整理后的内容：

---

# Tailwind CSS 使用指南

## 启动开发服务

执行 `npm run start` 运行开发服务。

## 样式展示

可以看到，应用了样式：

```html
<div class="p-1 text-base"></div>
```

这些原子类是 Tailwind 提供的：

- `p-1` 是 `padding: 0.25rem`
- `text-base` 包含 `font-size` 和 `line-height`

可以在 `tailwind.config.js` 中修改 `p-1` 的值，例如设置为 `30px`。

## 配置文件修改

在 `tailwind.config.js` 的 `theme.extend` 中修改 `p-1` 的值：

```javascript
module.exports = {
  theme: {
    extend: {
      padding: {
        '1': '30px',
      },
    },
  },
};
```

刷新页面，样式会变为新的值。

## 内置原子类配置

所有 Tailwind 提供的内置原子类都可以配置。

可以使用 `[]` 语法临时设置一些值，例如 `text-[14px]` 会生成 `font-size: 14px` 的样式。

## 状态和响应式样式

在 Tailwind 中，可以通过以下方式指定不同状态下的样式：

```html
<div class="hover:text-[30px] md:bg-blue-500"></div>
```

生成的代码包含带状态的类。

## 断点配置

断点位置可以在配置文件中修改：

```javascript
module.exports = {
  theme: {
    screens: {
      md: '1024px',
    },
  },
};
```

## 原子化 CSS 的好处

1. **无需命名类**：减少了命名类的困扰。
2. **CSS 不会无限增长**：减少了重复样式的定义。
3. **样式无模块作用域**：避免样式相互覆盖和错乱。

## 反对意见与回应

### 一堆类，可读性、可维护性差
- **回应**：使用 Tailwind CSS 提供的 VSCode 插件可以解决。

### 需要每次查文档
- **回应**：安装 Tailwind CSS IntelliSense 插件，有智能提示功能。

### 难以调试
- **回应**：在 Chrome DevTools 中直接查看样式，更容易调试。

### 类型太长且重复多次
- **回应**：使用 `@layer` 和 `@apply` 指令来扩展。

### 内置类无法满足需求
- **回应**：可以开发 Tailwind 插件扩展原子类。

### 类名冲突
- **回应**：通过添加前缀解决：

```javascript
module.exports = {
  prefix: 'tw-',
};
```

## 实现原理

Tailwind 可以单独运行，也可以作为 PostCSS 插件运行。它本质上是一个 PostCSS 插件，通过 AST 实现 CSS 代码生成，并通过 Extractor 提取 JS、HTML 中的类名。

## 总结

Tailwind 是一个流行的原子化 CSS 框架，使用简单：

- 所有预定义类都可以通过配置文件修改。
- 所有类都可以通过 `hover:xxx`、`md:xxx` 等方式组合使用。
- 使用原子化 CSS 可以减少样板代码和类名命名问题，提高开发效率。

---