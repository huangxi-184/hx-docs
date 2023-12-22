---
title: es7新增内容
shortTitle: es7
icon: fab fa-markdown
isOriginal: false
date: 2023-08-29
order: -4
category:
  - javascript
tag:
  - es7
  - javascript
---

ECMAScript 7（ES7）是 JavaScript 的一个版本，也称为 ES2016。它引入了一些新的语言特性和功能来增强 JavaScript 的能力。以下是 ES7 的一些主要新特性，并附带了一些示例说明：

1. **Array.prototype.includes() 方法**：用于检查数组是否包含特定元素，返回一个布尔值。

   示例：

   ```javascript
   const numbers = [1, 2, 3, 4, 5];
   const includesThree = numbers.includes(3);
   console.log(includesThree); // 输出: true
   ```

2. **Exponentiation Operator（指数运算符）**：使用双星号 `**` 来进行指数运算。

   示例：

   ```javascript
   const squared = 2 ** 3; // 2的3次方，结果为8
   console.log(squared); // 输出: 8
   ```

3. **Async/Await**：使用`async`和`await`关键字来处理异步操作，使得异步代码看起来更像同步代码，更易于阅读和维护。

   示例：

   ```javascript
   async function fetchData() {
     const response = await fetch("https://api.example.com/data");
     const data = await response.json();
     return data;
   }
   ```

4. **Object.values() 和 Object.entries() 方法**：分别用于提取对象的值数组和键值对数组。

   示例：

   ```javascript
   const person = { name: "Alice", age: 30, profession: "engineer" };

   const valuesArray = Object.values(person);
   console.log(valuesArray); // 输出: ['Alice', 30, 'engineer']

   const entriesArray = Object.entries(person);
   console.log(entriesArray);
   // 输出: [['name', 'Alice'], ['age', 30], ['profession', 'engineer']]
   ```

5. **String.prototype.padStart() 和 String.prototype.padEnd() 方法**：用于在字符串的开头或结尾填充指定字符，以达到指定的长度。

   示例：

   ```javascript
   const originalString = "42";
   const paddedString = originalString.padStart(5, "0"); // 在开头填充0，总长度为5
   console.log(paddedString); // 输出: '00042'
   ```
