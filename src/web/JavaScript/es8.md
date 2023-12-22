---
title: es8新增内容
shortTitle: es8
icon: fab fa-markdown
isOriginal: false
date: 2023-08-29
order: -3
category:
  - javascript
tag:
  - es8
  - javascript
---

## ES8（ECMAScript 2017）新特性

1. **`Object.values()` 和 `Object.entries()` 方法**

   `Object.values()` 方法用于提取对象的值数组，而 `Object.entries()` 方法用于提取对象的键值对数组。

   示例：

   ```javascript
   const person = { name: "Alice", age: 30, profession: "engineer" };

   const valuesArray = Object.values(person);
   // 输出: ['Alice', 30, 'engineer']

   const entriesArray = Object.entries(person);
   // 输出: [['name', 'Alice'], ['age', 30], ['profession', 'engineer']]
   ```

2. **字符串填充方法：`String.prototype.padStart()` 和 `String.prototype.padEnd()`**

   这些方法用于在字符串的开头或结尾填充指定字符，以达到指定的长度。

   示例：

   ```javascript
   const originalString = "42";
   const paddedString = originalString.padStart(5, "0");
   // 输出: '00042'
   ```

3. **异步迭代器（Async Iterators）**

   允许通过 `for-await-of` 循环处理异步生成器（Async Generators）返回的异步值。

   示例：

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

4. **共享内存和原子操作（Shared Memory and Atomics）**

   引入了 `SharedArrayBuffer` 和 `Atomics` 对象，用于在多个 Web Workers 之间共享内存和执行原子操作。

5. **新增正则表达式功能：命名捕获组（Named Capture Groups）**

   允许在正则表达式中使用命名捕获组，以便更容易地从匹配中提取信息。

   示例：

   ```javascript
   const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
   const match = regex.exec("2023-08-29");
   console.log(match.groups.year); // 输出: '2023'
   ```

6. **`Object.getOwnPropertyDescriptors()` 方法**

   用于获取指定对象的所有自身属性的描述符。

   示例：

   ```javascript
   const obj = { property: "value" };
   const descriptors = Object.getOwnPropertyDescriptors(obj);
   ```
