---
title: Vben Admin 小技巧
shortTitle: tips
icon: fab fa-markdown
order: 1
category:
  - tips
tag:
  - tips
---

### Form Slots

这里是使用表格时,开启表单搜索后,自定义(slot)使用搜索表单时使用. 将插槽插入到原本表格的内部.

当开启表单(form)后，以`form-xxxx`为前缀的插槽(slot)会被视为表单(form)的插槽。

`xxxx`是指表单组件的插槽名称。具体参考[表单组件文档](https://doc.vvbin.cn/components/form.html)。

**示例：**

- `form-submitBefore`: 在提交之前的插槽。

### 常用的 tsconfig(较严格)配置.

```json
{
  "compilerOptions": {
    "target": "ESNext", // 目标 ECMAScript 版本
    "module": "ESNext", // 模块系统 (可以根据需求选择其他选项)
    "strict": true, // 启用所有严格类型检查选项
    "esModuleInterop": true, // 启用默认导出的互操作性
    "skipLibCheck": true, // 跳过声明文件的类型检查
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写一致性
    "strictNullChecks": true, // 启用严格的 null 检查
    "strictFunctionTypes": true, // 启用严格的函数类型检查
    "strictPropertyInitialization": true, // 启用严格的属性初始化检查
    "noImplicitAny": true, // 禁止隐式的 any 类型
    "noImplicitThis": true, // 禁止隐式的 this 类型
    "alwaysStrict": true, // 总是在严格模式下解析代码
    "noUnusedLocals": true, // 检测未使用的局部变量
    "noUnusedParameters": true, // 检测未使用的函数参数
    "noImplicitReturns": true, // 禁止缺少返回语句的函数
    "noFallthroughCasesInSwitch": true, // 检测 switch 语句中的缺陷
    "baseUrl": "./", // 基本目录，用于解析非相对模块名
    "outDir": "./dist", // 输出目录
    "rootDir": "./src", // 根源文件夹
    "paths": {
      "*": ["src/*"] // 模块名到基于 baseUrl 的路径映射
    },
    "typeRoots": ["./node_modules/@types"], // 声明文件的查找位置
    "lib": ["ESNext", "DOM"], // 编译器需要的库定义
    "resolveJsonModule": true, // 启用 JSON 模块解析
    "declaration": true, // 生成声明文件
    "declarationMap": true, // 生成声明文件映射
    "sourceMap": true, // 生成源映射文件
    "strictBindCallApply": true, // 严格检查 'bind', 'call', 和 'apply' 方法
    "esModuleInterop": true, // 启用默认导出的互操作性
    "allowSyntheticDefaultImports": true // 允许导入默认导出，即使它们没有明确声明
  },
  "include": ["src/**/*.ts"], // 包含的源文件
  "exclude": ["node_modules"] // 排除的文件夹
}
```

### 正则匹配全部的`console.log()`

```RegExp
console.log.*$
```

### 快速删除全部的 node_modules(python)

```python
import os
import shutil


def delete_directory(path):
    try:
        if os.path.exists(path):
            shutil.rmtree(path)
    except Exception as e:
        print(f"An error occurred: {e}")


if __name__ == "__main__":
    target_directory = "./node_modules"
    delete_directory(target_directory)
```
