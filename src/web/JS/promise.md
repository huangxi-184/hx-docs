---
title: promise详解
shortTitle: promise详解
icon: fab fa-markdown
date: 2023-09-01
order: 2
category:
  - javascript
tag:
  - promise
---

## promise 详解

**定义: promise 对象表示一个对象最终成功或失败,以及它们的结果值**

1. 如何使用 promise 对象
   Promise 是一个函数返回的对象，我们可以在它上面绑定回调函数，这样我们就不需要在一开始把回调函数作为参数传入这个函数了

**约定**
在使用 Promise 时，会有以下约定：

- 在本轮 事件循环 运行完成之前，回调函数是不会被调用的。
- 即使异步操作已经完成（成功或失败），在这之后通过 then() 添加的回调函数也会被调用。
- 通过多次调用 then() 可以添加多个回调函数，它们会按照插入顺序进行执行。

then 里的参数是可选的， catch 是 then(null, failureCallback) 的缩略形式 即 catch
就是没有成功回调 认为默认设置为了 失败的回调

promise 一定要有返回值，否则，callback 将无法获取上一个 Promise 的结果 无法形成链式调用

Promise 接受一个「函数」作为参数，该函数的两个参数分别是 resolve 和 reject。这两个函数就是就是「回调函数」
其中 resolve 函数的作用：在异步操作成功时调用，并将异步操作的结果，作为参数传递出去； 成功的回调
reject 函数的作用：在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去 失败的回调

Promise 对象的状态改变，只有两种可能： 只能从初始转态转化成 成功状态或者失败状态

- 从 pending 变为 fulfilled。
- 从 pending 变为 rejected。

**promise 的三种状态 分别为 pending fulfilled rejected 这三种状态**

### 有三种方法来使用 promise

1. 使用构造函数

```js
let promies = new Promise((resolve, reject) => {
  resolve(); //异步处理
});
Promise; //构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。
```

2. 使用 Promise 实例的方法 promise 的
   `promise.then(onFulfilled, onRejected);` 通过.then 的返回值也是 promise 一起来总结

3. Promise 的静态方法 如 Promise.resolve() Promise.reject()

```JavaScript
var p = Promise.resolve();
p.then(function(value) {
    console.log(value);
});
```

### promise 的静态方法

- Promise.all(iterable)

  > 该方法等到所有的 promise 对象都成功或有任意一个 promise 失败 才返回一个 promise
  > 如果所有的 promise 都成功了，它会把一个包含 iterable 里所有 promise 返回值的数组作为成功回调的返回值
  > 一旦有任意一个 iterable 里面的 promise 对象失败则立即以该 promise 对象失败的理由来拒绝这个新的 promise

- Promise.allSettled(iterable)

  > 等到所有 promise 都已敲定,则再返回一个 promise，该 promise 在所有 promise 都敲定后完成，并兑现一个对象数组，其中的对象对应每个 promise 的结果

- Promise.any(iterable)

  > 接收一个 promise 对象的集合，当其中的任意一个 promise 成功，就返回那个成功的 promise 的值

- Promise.race(iterable)

  > 当 iterable 参数里的任意一个子 promise 成功或失败后，父 promise 马上也会用子 promise 的成功返回值或失败详情作为参数调用父 promise 绑定的相应处理函数，并返回该 promise 对象

- Promise.reject(reason)

  > 返回一个状态为已拒绝的 Promise 对象，并将给定的失败信息传递给对应的处理函数。

- Promise.resolve(value)
  > 返回一个状态由给定 value 决定的 Promise 对象。如果该值是 thenable（即，带有 then 方法的对象），返回的 Promise 对象的最终状态由 then 方法执行结果决定；否则，返回的 Promise 对象状态为已兑现，并且将该 value 传递给对应的 then 方法。

**resolve 方法允许调用时不带参数，直接返回一个 resolved 状态的 Promise 对象。**
