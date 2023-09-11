---
title: Grid布局-最新最强的CSS布局
shortTitle: Grid布局
icon: fab fa-markdown
date: 2023-09-06
order: 2
category:
  - CSS布局
tag:
  - Grid
---

一:基础概念
容器和项目：我们通过在元素上声明 display：grid 或 display：inline-grid 来创建一个网格容器。一旦我们这样做，这个元素的所有直系子元素将成为网格项目。比如上面 .wrapper 所在的元素为一个网格容器，其直系子元素将成为网格项目。

```css
.wrapper {
  margin: 60px;
  /* 声明一个容器 */
  display: grid;
  /*  声明列的宽度  */
  grid-template-columns: repeat(3, 200px);
  /*  声明行间距和列间距  */
  grid-gap: 20px;
  /*  声明行的高度  */
  grid-template-rows: 100px 200px;
}
```
网格轨道：grid-template-columns 和 grid-template-rows 属性来定义网格中的行和列。容器内部的水平区域称为行，垂直区域称为列。

Grid 布局属性
Grid 布局属性可以分为两大类，一类是容器属性，一类是项目属性。我们先来看容器属性

display 属性