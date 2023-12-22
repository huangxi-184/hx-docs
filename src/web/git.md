---
title: git常用命令
shortTitle: git常用命令
icon: fab fa-markdown
date: 2023-09-01
order: 4
category:
  - git
tag:
  - git
---

## 分布式版本管理 git 的常用命令

`git status` 查看仓库状态

`git reflog` 查看提交记录

`git log` 查看详细提交记录

`git add 文件名` 添加文件到暂存去

`git commit -m '描述信息' 文件名` 提交暂存区的文件到本地版本管理

`git checkout branch名` 切换分支

`git init` 初始化 git 本地仓库

`git clone 远程库的地址` 克隆远程仓库,非团队成员不可直接提交,非团队成员需要 fork 叉取一份,修改后发起 pull request 取请求拉去合并

`git clone -b 分支名 地址` 克隆某个分支的代码 不加参数会默认克隆主分支的代码

`git checkout -- file` 撤销工作的文件修改

`git add .` add . 即是提交全部的工作区修改到暂存区

`git reset HEAD --hard ` 回退版本

`git branch 分支名` 新建分支

`git branch` 查询所有的分支

`git branch -v` 查看分支的哈希值和提交信息

`git merge 分支名` 将其他分支合并到本分支的上
由于 git 是按照行管理的,需要注意合并的冲突问题,有冲突后需要手打取提交
