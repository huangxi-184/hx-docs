---
title: ES8新增内容
shortTitle: ES8
icon: fab fa-markdown
isOriginal: false
date: 2023-08-29
order: 2
category:
  - JavaScript
tag:
  - ES8
  - JavaScript
---

## ES8（ECMAScript 2017）新特性

### 1. `Object.values()` 和 `Object.entries()` 方法

- `Object.values()` 方法用于提取对象的值数组。
- `Object.entries()` 方法用于提取对象的键值对数组。注意这两个方法不能保证顺序。

**示例**:

```javascript
const person = { name: "Alice", age: 30, profession: "engineer" };

const valuesArray = Object.values(person);
// 输出: ['Alice', 30, 'engineer']

const entriesArray = Object.entries(person);
// 输出: [['name', 'Alice'], ['age', 30], ['profession', 'engineer']]

const obj = { name: 'Tom', age: 18 };
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}
// 输出:
// name Tom
// age 18
```

### 2. 字符串填充方法：`String.prototype.padStart()` 和 `String.prototype.padEnd()`

- 这些方法用于在字符串的开头或结尾填充指定字符，以达到指定的长度。

**示例**:

```javascript
const originalString = "42";
const paddedString = originalString.padStart(5, "0");
// 输出: '00042'
console.log('a'.padEnd(5, '2')); // a2222
```

### 3. `async/await`

- `Promise`的语法糖，但更简单易用。
- `async`/`await` 允许我们以更简洁的方式处理异步操作，无需手动处理 Promise 的状态和回调。
- `await`后面的代码本质上是在 `Promise.then()` 中执行的。

**示例**:

```javascript
async function fn() { ... }
try {
  await fn();
} catch (err) {}
```

### 4. 共享内存和原子操作（Shared Memory and Atomics）

- 引入了 `SharedArrayBuffer` 和 `Atomics` 对象，用于在多个 Web Workers 之间共享内存和执行原子操作。

### 5. `Object.getOwnPropertyDescriptors()` 方法

- 用于获取指定对象的所有自身属性的描述符。

**示例**:

```javascript
const obj = {
  name: 'Tom',
  run: () => ``,
};
console.log(Object.getOwnPropertyDescriptors(obj));
// 输出:
// {
//   name: {
//     value: 'Tom',
//     writable: true,
//     enumerable: true,
//     configurable: true
//   },
//   run: {
//     value: [Function: run],
//     writable: true,
//     enumerable: true,
//     configurable: true
//   }
// }
```

### 6. 参数列表支持尾逗号

- 支持在函数声明及调用时末尾增加逗号而不报 `SyntaxError` 错误。

**示例**:

```javascript
function add(a, b,) {
  return a + b;
}
add(1, 2,)
```