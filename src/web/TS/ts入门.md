---
title: TypeScript
shortTitle: TypeScript
icon: fab fa-markdown
isOriginal: false
date: 2023-09-21
order: 1
category:
  - TypeScript
tag:
  - TypeScript
---

使用 TypeScript 的第一步. 安装依赖.

`pnpm i -g typescript`

判断是否成功.

`tsc -v`

编译命令: `tsc 文件名.ts`

直接运行方式: 1: 安装`ts-node`, `pnpm i -g ts-node`

2.执行命令(方式一) `ts-node 文件名.ts`

3. 使用 Code Runner 来运行.(方式二) 快捷键`Ctrl+Alt+N` 若是失败了,需要配置一下 tsconfig.json 文件.最外层添加以下文件即可
   .

```json
  "ts-node": {
    "esm": true
  }
```

## type 类型

基础类型一: number

```ts
// 十进制
let decLiteral: number = 6;
// 十六进制
let hexLiteral: number = 0xf00d;
// 二进制
let binaryLiteral: number = 0b1010;
// 八进制
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

基础类型二: boolean

```ts
let flag: boolean = false;
```

基础类型三: string

```ts
let myName: string = "Echo";
```

基础类型四五: null,undefined 是所有类型的子类型,但是不要随意赋值给其他类型. 最好打开 tsconfig.json 文件,
将`strictNullChecks`设置为`true`

基础类型六: symbol

```ts
const sym2: symbol = Symbol("lizi");
```

基础类型七: bigint

```ts
let big1: bigint = 10n;
let big2: bigint = BigInt(10);
```

引用类型一: 数组虽然可以保存不一样类型的数据,但推荐专数组专用.

```ts
let num: number[] = [1, 2, 3, 4];
let num2: Array<number> = [1, 2, 3, 4];
```

多种类型写法:

```ts
let num3: (number | string)[] = [1, "2", "3", 4];
// 不加括号就是. 数字或字符数组
let num4: number | string[] = 123;
```

引用类型二: 函数

```ts
// 函数声明(写上形参的类型,并标注上返回值的类型即可)
function sum(x: number, y: number): number {
  return x + y;
}

// 函数表达式(写上形参的类型,并标注上返回值的类型即可)
const sum2 = (x: number, y: number): nubmer => {
  return x + y;
};

// 没有return时, 使用void的方式.
const sum3 = (x: number, y: number): void => {
  //   doSomething()
};

// 可选参数必须位于后面. 参数后面给个?.就行
function sum4(x: number, y?: number): void {}

// 默认值设置, 加个 =
function buildName(firstName: string, lastName: string = "Cat"): string {
  return firstName + " " + lastName;
}

// 剩余参数
function push(firstNumber: number, ...items: number[]) {}
```

函数重载, 就是函数名相同, 但是参数类型不同, 返回值类型也不同. 多次申明,函数的规则,最后配合联合类型使用.

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === "number") {
    return Number(x.toString().split("").reverse().join(""));
  } else if (typeof x === "string") {
    return x.split("").reverse().join("");
  }
}

// 但是不能分开定义,和其他语言不同.再或者配合泛型使用.
// 以下方式使用,会报错. 函数定义重复
function reverse(x: number): number {
  return Number(x.toString().split("").reverse().join(""));
}

function reverse(x: string): string {
  return x.split("").reverse().join("");
}
```

### 对象类型

直接描述对象的类型,没有意义. 所以要描述,对应的属性,和属性类型.方法以及方法类型.

```ts
let person: {
  readonly name: string;
  age?: number;
  sayHi: () => void;
  greet: (name: string) => void;
} = {
  name: "John",
  age: 25,
  sayHi() {},
  greet(name) {}
};
```

同理,可选?标记即可.

只读标记 readonly, 表示属性不可修改.

### 元组类型

特点:长度固定, 元素类型可以不同.

```ts
let tuple: [string, number, boolean] = ["Echo", 26, true];

可使用解构语法.解构语法是按照顺序解构的;
let [str, num77] = tuple;
```

元组也可以是可选的. ? 表示, 这样对应的位置就是 undefined.

```ts
let tuple: readonly [string, number] = ["Echo", 26];
```

### 字面量类型

```ts
// 其他同理
let direction: "Up" | "Right" | "Down" | "Left";
```

### 枚举类型

```ts
// 默认是从0开始,依次递增. 0,1,2,3
enum Direction {
  Up,
  Down,
  Left,
  Right
}
```

### any 类型

1. 变量初始化,不给默认值,不给类型,则是 any 类型
2. 函数参数,不给类型,则是 any 类型

```ts
// 万能类型,使用则跳过类型检验.
let notSure: any = 4;
```
** 如果你在 TypeScript 中定义了一个回调函数，但是不需要读取该回调函数的值，可以使用下划线 _ 作为未使用参数的占位符。这是一种常见的做法，用来表示你知道这个参数存在，但是并不打算在函数体内使用它。 **

** 使用下划线 _ 是一种约定俗成的方式，表示这个参数是有意未使用的。这样可以让 TypeScript 编译器不再发出“未使用的变量”警告 **