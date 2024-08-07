### JavaScript 数据类型

#### 原始数据类型
- `string`
- `number`
- `bigint`
- `boolean`
- `undefined`
- `symbol`
- `null`

#### 复杂数据类型
- `object`
- `array`
- `function`
- 复杂数据类型均为 `object` 的子类

### 数据类型转换
- `tostring()` 转换为字符串
- `Number()` 转换为数字
- `Boolean()` 转换为布尔值
- `parseInt()` 转换为整数
- `String()` 转换为字符串

### `typeof` 结果
- 其他值返回正常结果，只有以下三条特殊：
  - `typeof null` 返回 `object`
  - `typeof Function` 返回 `function`
  - `typeof Array` 返回 `object`

复杂内容的判断需要 `instanceof` 来判断：`[] instanceof Array`

### 原型链
每个构造函数（例如 `Array`）都有自己的原型对象 `Prototype`。当 `Array` 实例化时，通过 `__proto__` 找到原型对象的属性。例如：

- `array.__proto__ === Array.prototype`
- `Array.prototype.__proto__ === Object.prototype`
- `Object.prototype.__proto__ === null`

这种通过 `__proto__` 查找原型对象属性的链式结构称为原型链。

### 作用域和作用域链
- **作用域**：代码的执行环境。全局执行环境是全局作用域。
- **作用域链**：一系列作用域，当需要查找某个变量或函数时，会按作用域链的顺序查找，直到找到为止。

浏览器全局对象是 `window`，Node.js 中是 `global`。全局属性 `globalThis` 在浏览器和 Node.js 环境下都指向全局对象。

### 深拷贝和浅拷贝的方法
#### 深拷贝
- 推荐方法：`JSON.parse(JSON.stringify(obj))`
- 复杂数据结构：建议使用 `lodash` 的深拷贝方法 `_.cloneDeep(obj)`
- 结构化克隆方法：`structuredClone(obj)` 性能更佳
- 手动实现深拷贝：
  ```javascript
  function deepClone(obj) {
      if (obj === null || typeof obj !== "object") {
          return obj; // 返回非对象的值（包括 null）
      }

      const objClone = Array.isArray(obj) ? [] : {};

      for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
              if (obj[key] && typeof obj[key] === "object") {
                  objClone[key] = deepClone(obj[key]); // 递归深拷贝
              } else {
                  objClone[key] = obj[key];
              }
          }
      }

      return objClone;
  }
  ```

#### 浅拷贝
1. `Object.assign({}, obj)`
2. `{...obj}`
3. 循环取出键值，赋值给新对象

### 闭包
闭包使一个函数能够记住并访问其定义时的作用域，即使函数在其作用域外部被调用。闭包用于私有数据的封装和数据的缓存。例如：
```javascript
function createCounter() {
    let count = 0;
    return function() {
        return ++count;
    }
}
let counter = createCounter();
counter(); // 1
counter(); // 2
counter = null; // 释放闭包
```

### `call`、`apply`、`bind` 的区别
- `call` 和 `apply` 都用于改变函数执行的上下文，区别是接收参数的方式不同：
  - `apply(this, [args])`：第一个参数是 `this`，第二个参数是数组
  - `call(this, arg1, arg2, ...)`：第一个参数是 `this`，其余参数按顺序传入
- `bind` 也用于改变函数执行的上下文，但返回一个新的函数，该函数可以接收参数，并在调用时绑定给定的 `this` 值。

### DOM 事件
- `onmouseover`：鼠标指针移入时执行事件
- `onmouseout`：鼠标指针移出时执行事件
- `onmousedown`：鼠标按下时执行事件
- `onmouseup`：鼠标松开时执行事件

### 宏任务与微任务
- **宏任务**：`setTimeout`、`setInterval`、I/O、UI 渲染、`requestAnimationFrame`
- **微任务**：`Promise`、`MutationObserver`

宏任务在当前任务执行完之前执行，如 `setTimeout`、`setInterval`、I/O、UI 渲染。微任务在当前任务执行完之后执行，如 `Promise`、`MutationObserver`。

### 0.5 毫米的线
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div></div>

    <style>
      div {
        left: 0;
        top: 0;
        margin-top: 20px;
        width: 100%;
        height: 1px;
        background-color: red;
        transform: scaleY(0.5);
        transform-origin: center center;
      }
    </style>
  </body>
</html>
```