---
title: Observer
shortTitle: Observer
icon: fab fa-markdown
date: 2024-07-03
order: 2
category:
  - Observer
tag:
  - Observer
---

# 浏览器中的观察者API

在网页开发中，我们经常需要处理用户交互，例如使用 `addEventListener` 来监听各种用户操作，比如 `click`、`mousedown`、`mousemove`、`input` 等事件，这些都是由用户直接触发的事件。

那么对于一些不是由用户直接触发的事件，比如元素从不可见到可见、元素大小的改变、元素的属性和子节点的修改等，这类事件如何监听呢？

浏览器提供了 5 种观察者来监听这些变动：`MutationObserver`、`IntersectionObserver`、`PerformanceObserver`、`ResizeObserver`、`ReportingObserver`。

## IntersectionObserver

一个元素从不可见到可见，从可见到不可见，这种变化如何监听呢？

用 `IntersectionObserver`。

`IntersectionObserver` 可以监听一个元素和可视区域相交部分的比例，然后在可视比例达到某个阈值的时候触发回调。

我们准备两个元素：

```html
<div id="box1">BOX111</div>
<div id="box2">BOX222</div>
```

加上样式：

```css
#box1, #box2 {
    width: 100px;
    height: 100px;
    background: blue;
    color: #fff;
    position: relative;
}
#box1 {
    top: 500px;
}
#box2 {
    top: 800px;
}
```

这两个元素分别在 500 和 800 px 的高度，我们监听它们的可见性的改变：

```javascript
const intersectionObserver = new IntersectionObserver(
    function (entries) {
        console.log('info:');
        entries.forEach(item => {
            console.log(item.target, item.intersectionRatio)
        })
    }, {
    threshold: [0.5, 1]
});

intersectionObserver.observe(document.querySelector('#box1'));
intersectionObserver.observe(document.querySelector('#box2'));
```

创建一个 `IntersectionObserver` 对象，监听 `box1` 和 `box2` 两个元素，当可见比例达到 0.5 和 1 的时候触发回调。

浏览器跑一下：

可以看到元素 `box1` 和 `box2` 在可视范围达到一半（0.5）和全部（1）的时候分别触发了回调。

### 应用场景

- **数据采集**：希望知道某个元素是否可见，什么时候可见。
- **懒加载**：当可视比例达到某个比例时再触发加载。

## MutationObserver

`MutationObserver` 可以监听对元素的属性的修改、对它的子节点的增删改。

我们准备这样一个盒子：

```html
<div id="box"><button>光</button></div>
```

加上样式：

```css
#box {
    width: 100px;
    height: 100px;
    background: blue;
    position: relative;
}
```

定时对它做修改：

```javascript
setTimeout(() => {
    box.style.background = 'red';
}, 2000);

setTimeout(() => {
    const dom = document.createElement('button');
    dom.textContent = '东东东';
    box.appendChild(dom);
}, 3000);

setTimeout(() => {
    document.querySelectorAll('button')[0].remove();
}, 5000);
```

监听它的变化：

```javascript
const mutationObserver = new MutationObserver((mutationsList) => {
    console.log(mutationsList)
});

mutationObserver.observe(box, {
    attributes: true,
    childList: true
});
```

创建一个 `MutationObserver` 对象，监听这个盒子的属性和子节点的变化。

浏览器跑一下：

可以看到在三次变化的时候都监听到了并打印了一些信息：

- **第一次**改变的是 `attributes`，属性是 `style`。
- **第二次**改变的是 `childList`，添加了一个节点。
- **第三次**也是改变的 `childList`，删除了一个节点。

### 应用场景

- **防止去除水印**：文章水印被通过 `devtools` 去掉时重新加上。
- **监听动态内容变化**。

## ResizeObserver

窗口可以用 `addEventListener` 监听 `resize` 事件，那元素呢？

元素可以用 `ResizeObserver` 监听大小的改变，当 `width`、`height` 被修改时会触发回调。

我们准备这样一个元素：

```html
<div id="box"></div>
```

添加样式：

```css
#box {
    width: 100px;
    height: 100px;
    background: blue;
}
```

在 2s 的时候修改它的高度：

```javascript
const box = document.querySelector('#box');

setTimeout(() => {
    box.style.width = '200px';
}, 3000);
```

用 `ResizeObserver` 监听它的变化：

```javascript
const resizeObserver = new ResizeObserver(entries => {
    console.log('当前大小', entries)
});
resizeObserver.observe(box);
```

浏览器跑一下：

大小变化被监听到了，可以拿到元素和它的位置、尺寸。

### 应用场景

- **监听元素大小变化**。
- **动态布局调整**。

## PerformanceObserver

`PerformanceObserver` 用于监听记录 `performance` 数据的行为，一旦记录了就会触发回调，这样我们就可以在回调里把这些数据上报。

比如 `performance` 可以用 `mark` 方法记录某个时间点：

```javascript
performance.mark('registered-observer');
```

用 `measure` 方法记录某个时间段：

```javascript
performance.measure('button clicked', 'from', 'to');
```

用 `PerformanceObserver` 监听它们：

```html
<html>
<body>
  <button onclick="measureClick()">Measure</button>

  <img src="https://p9-passport.byteacctimg.com/img/user-avatar/4e9e751e2b32fb8afbbf559a296ccbf2~300x300.image" />

  <script>
    const performanceObserver = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        console.log(entry); // 上报
      })
    });
    performanceObserver.observe({ entryTypes: ['resource', 'mark', 'measure'] });

    performance.mark('registered-observer');

    function measureClick() {
      performance.measure('button clicked');
    }
  </script>
</body>
</html>
```

浏览器跑一下试试：

可以看到 `mark` 的时间点记录、资源加载的耗时、点击按钮的 `measure` 时间段记录都监听到了。

### 应用场景

- **性能分析**：记录并上报 `performance` 数据。

## ReportingObserver

`ReportingObserver` 用于监听过时的 API、浏览器干预等报告。

创建 `ReportingObserver` 对象：

```javascript
const reportingObserver = new ReportingObserver((reports, observer) => {
    for (const report of reports) {
        console.log(report.body); // 上报
    }
}, { types: ['intervention', 'deprecation'] });

reportingObserver.observe();
```

### 应用场景

- **监听过时的 API**。
- **浏览器干预**。

## 总结

监听用户的交互行为，我们会用 `addEventListener` 来监听 `click`、`mousedown`、`keydown`、`input` 等事件，但对于元素的变化、`performance` 的记录、浏览器干预行为这些不是用户交互的事件就要用 `XxxObserver` 的 API 了。

浏览器提供了这 5 种 Observer：

- `IntersectionObserver`：监听元素可见性变化，常用来做元素显示的数据采集、图片的懒加载。
- `MutationObserver`：监听元素属性和子节点变化，比如可以用来做去不掉的水印。
- `ResizeObserver`：监听元素大小变化。

还有两个与元素无关的：

- `PerformanceObserver`：监听 `performance` 记录的行为，来上报数据。
- `ReportingObserver`：监听过时的 API、浏览器的一些干预行为的报告，可以让我们更全面地了解网页 app 的运行情况。

这些 API 相比 `addEventListener` 添加的交互事件来说用得比较少，但是在特定场景下都是很有用的。
