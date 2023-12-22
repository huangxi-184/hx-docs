---
title: 命名规范
shortTitle: 命名规范
icon: fab fa-markdown
date: 2023-09-01
order: 2
category:
  - 命名规范
  - 开发规范
tag:
  - 命名规范
---

# 编程规范

## 命名规范

1. **变量名统一使用小驼峰式命名法：`例如：userName userInfo `**
2. **文件夹名,url 路径,只使用小写字母,若过长则使用-进行分隔**  
   `sr/dev/document/front-end/project-vue3`
3. **布尔类型需要添加`has, is, wether, can, should`之类的参数**
4. **数组和集合需要以`s`或`list`等方式来结尾**
5. **常量全部大写，且用下划线来分割单词**  
   `MAX_LENGTH = 1`
6. **函数使用小驼峰方式 `lowerCamelCase`,只有构造函数才使用大驼峰的方式**
7. **css 中的类名全部小写字母,由`-`连接.Id 则都使用小驼峰式命名**
   ```css
   .heavy {
     font-weight: 800;
   }
   .important {
     color: red;
   }
   promiseCallback {
     text: color;
   }
   ```
   ::: warning
   **使用新技术前要考量其学习成本、带来的收益以及存在的风险等等，切勿盲目追行情**
   :::

## Git 规范

**统一规范`<type>(<scope>): <subject>`**
**例如:`feat(user): 增加用户中心的 xx 功能`**

```jsx
scope表示 commit 的作用范围，如用户中心、购物车中心，也可以是目录名称，一般可以限定几种;
subject用于对 commit 进行简短的描述;
type 必填，表示提交类型，值一般有以下几种;
```

> feat：新功能 feature  
> bug：测试反馈 bug 列表中的 bug  
> fix： 修复 bug  
> ui：更新 UI；  
> docs： 文档注释变更  
> style： 代码格式(不影响代码运行的变动)；  
> refactor： 重构、优化(既不增加新功能，也不是修复 bug)；  
> perf： 性能优化；  
> release：发布；  
> deploy：部署；  
> test： 增加测试  
> chore： 构建过程或辅助工具的变动  
> revert： 回退  
> build： 打包

## BFF 中间层

**基于后端的微服务,聚合多个微服务接口,单个接口至多只能聚合五个微服务接口**

**中间层,前台不承载特定技术能力,如文档打印、Excel 生成、算法逻辑等**

> 前端需要根据接口文档进行 Mock, 模拟对接后端接口；联调之前，要求后端做好接口测试；
