---
title: ES9新增内容
shortTitle: ES9
icon: fab fa-markdown
isOriginal: false
date: 2023-08-29
order: -2
category:
  - JavaScript
tag:
  - ES9
  - JavaScript
---

## ES9（ECMAScript 2018）新特性

### 1. Rest/Spread 属性

- 允许在对象和数组的解构赋值中使用 `...` 来分别收集和展开剩余的属性。

**示例**:

```javascript
const { x, ...rest } = { x: 1, y: 2, z: 3 };
// rest: { y: 2, z: 3 }

const array = [1, 2, 3, 4];
const [first, ...restArray] = array;
// restArray: [2, 3, 4]
```

### 2. 正则表达式命名捕获组（Named Capture Groups）

- 允许在正则表达式中使用命名捕获组，以便更容易地从匹配中提取信息。

**示例**:

```javascript
const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = regex.exec("2023-08-29");
console.log(match.groups.year); // 输出: '2023'
console.log(match.groups); // { year: '2023', month: '08', day: '29' }
```

### 3. 正则表达式后行断言（Lookbehind Assertions）

- 允许正则表达式匹配在其前面的文本，类似于正向断言。

**示例**:

```javascript
const regex = /(?<=@)\w+/;
const match = regex.exec("user@example.com");
console.log(match[0]); // 输出: 'example'
```

### 4. `Promise.prototype.finally()` 方法

- 添加了 `finally` 方法，无论 Promise 的状态如何，都会执行指定的回调函数。

**示例**:

```javascript
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .catch((error) => console.error(error))
  .finally(() => console.log("Fetch completed."));
```

### 5. 解除模版字符串限制 - Lifting template literal restriction

- “解除模版字符串限制” 意味着在标签模板字符串中，非法的转义序列不会再导致 `SyntaxError`。相反，它们会被当作普通文本处理，或根据情况返回 `undefined`。

**示例**:

```javascript
function tag(strs) {
  console.log(strs[0]); // undefined
  console.log(strs.raw[0]); // "\\unicode and \\u{55}"
}
tag`\unicode and \u{55}`
```

### 6. 异步迭代器（Async Iterators）

- 允许通过 `for-await-of` 循环处理异步生成器（Async Generators）返回的异步值。

**示例**:

```javascript
async function* asyncGenerator() {
  yield await fetch("https://api.example.com/data");
}

(async () => {
  for await (const data of asyncGenerator()) {
    console.log(data);
  }
})();
```