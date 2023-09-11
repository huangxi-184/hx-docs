---
title: Vben Admin table 组件
shortTitle: table
icon: fab fa-markdown
order: 1
category:
  - table
tag:
  - table
---

## index.js

```ts
// 导出类型 export type 其他类似导出
export type { EditRecordRow } from "./src/components/editable";
// 将./src/BasicTaskTable.vue 目录下的默认导出重命名为BasicTaskTable,然后导出
export { default as BasicTaskTable } from "./src/BasicTaskTable.vue";
// 导出所有内容,常用单个文件来合并
export *
```

## BasicTable.vue

1. 最外层容器通过是否使用表单来确定 marginTop.`marginTop: getBindValues.useSearchForm ? 0 : 20`
2. `v-bind="getBindValues"` getBindValues 中的值都会绑定到 table 上面.
3. 平时配置的列都是放在这个插槽里,遍历每一个列. 然后参数传到 <HeaderCell> 这个组件里,作为表头

```vue
<template
  #[`header-${column.dataIndex}`]
  v-for="column in columns"
  :key="column.dataIndex"
>
  <HeaderCell :column="column" />
</template>
```

正则匹配全部的`console.log()`

```
console.log.*$
```
