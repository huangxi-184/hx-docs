---
title: ES7新特性
shortTitle: ES7
icon: fab fa-markdown
isOriginal: false
date: 2023-08-29
order: 1
category:
  - javascript
tag:
  - ES7
---

ECMAScript 7（ES7）是 JavaScript 的一个版本，也称为 ES2016。它引入了一些新的语言特性和功能来增强 JavaScript 的能力。以下是 ES7 的一些主要新特性。

1. **Array.prototype.includes() 方法**：用于检查数组是否包含特定元素，返回一个布尔值。

   示例：
   ```javascript
   const numbers = [1, 2, 3, 4, 5];
   const includesThree = numbers.includes(3);
   console.log(includesThree);
   // true 返回boolean值
   ```

2. **Exponentiation Operator（指数运算符）**：使用双星号 `**` 来进行指数运算。

   示例：

   ```javascript
   const squared = 2 ** 3; // 2的3次方，结果为8
   console.log(squared); // 输出: 8
   ```