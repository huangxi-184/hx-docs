---
title: vue总结
shortTitle: vue总结
icon: fab fa-markdown
date: 2023-09-15
order: 7
category:
  - vue
tag:
  - vue
---

## vue 总结

1.谈谈对 Vuex 的理解. vuex 是 vue 的状态管理工具，可以方便的实现组件之间的数据共享，可以方便的实现组件之间的通信. 若组件
的层级较深,关系比较复杂. 则需要使用 vuex 进行数据管理.

主要包含 state、getters、mutations、actions、modules 五个部分. state：用于存储数据，是响应式的，可以被 vue 组件 data 选
项中的数据覆盖. getters：用于对 state 中的数据进行计算，可以认为是 store 的计算属性. mutations：用于操作数据，通过提交
mutation 的方式，改变 state 中的数据.不推荐直接修改 state 中的数据,state 是实时更新的，mutations 无法进行异步操作，而如
果直接修改 state 的话是能够异步操作的. 导致数据异常.所以推荐使用 mutations 来操作数据. actions：用于提交
mutation，actions 提交的是 mutation，而不是直接变更状态. modules：用于 vuex 模块化，可以对 vuex 进行拆分，让代码更好维护
. 切分 vuex 模块后，每个模块拥有自己的 state、mutation、action、getters,使得代码结构非常清晰.

数据是存储在内存中的,如果刷新页面,数据就会丢失.

2.开发中,vue 常见的性能优化有哪些?

1. 响应式数据层级不要过深，合理的设置响应式数据.非响应式数据,可以不适用 ref,reactive 包裹. 或使用 Object.freeze()冻结数
   据.
2. 使用数据时，缓存值的结果，可以使用 computed 计算属性.减少重复计算.
3. v-for 保证 key 值唯一,提高渲染效率.
4. v-show(频繁切换性能高)和 v-if 的合理使用
5. 控制组件的粒度 -> Vue 采用组件级别更新
6. 采用函数式组件 -> 函数式组价开销低
7. 采用异步组件,按需加载.
8. 使用 keep-alive 来缓存组件,增加组件复用
9. 虚拟滚动、虚拟列表,实现大数据量的问题.

3.vue 的常见修饰符有哪些？ .stop 阻止事件冒泡 .prevent 阻止事件的默认行为。通常用于阻止表单的提交或者超链接的跳转等默认
行为。 .capture 事件捕获模式 捕获由外到内. 冒泡由内到外 .self 只有事件发生在绑定事件的元素本身时，才会触发事件处理程序
.once 事件只会被触发一次 .passive 告诉浏览器事件处理程序不会调用 event.preventDefault()，从而可以提高滚动性能。通常用于
滚动事件的优化 .right 只有鼠标右键点击时才触发事件处理程序 .center 只有鼠标中键点击时才触发事件处理程序。 .middle 只有鼠
标中键点击时才触发事件处理程序 .alt 只有在同时按下 "Alt" 键的情况下，才触发事件处理程序 .ctrl 只有在同时按下 "Ctrl" 键的
情况下，才触发事件处理程序等等

4.Vue 的组件 data 为什么必须是一个函数? 如果是使用对象直接存储,因为对象是引用类型,所以两个对象指向的地址,是相同的.多次使
用这个组件时,会导致数据相同的情况. 所以需要使用函数来返回,保证 data 相对于该组件来说,是唯一的.

5.
