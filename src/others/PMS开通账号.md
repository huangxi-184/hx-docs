---
title: PMS开账户和权限配置
shortTitle: PMS开账户
icon: fab fa-markdown
isOriginal: true
date: 2023-08-22
order: 1
category:
  - PMS
tag:
  - PMS
---

1. 判断此人是否已注册：

   ```sql
   SELECT *
   FROM dbo.Users
   WHERE Number = '11311';
   ```

   如果已注册，则继续第 4 步。

2. 查找相应个人的部门 ID：

   ```sql
   SELECT *
   FROM dbo.Departments
   WHERE State = 1 AND Name LIKE '%设备%';
   ```

3. 获得部门 ID 后，插入帐户：

   ```sql
   INSERT INTO dbo.Users(DepartmentId, Number, UserName, Password, State)
   VALUES (部门Id, '工号', '姓名', 'e10adc3949ba59abbe56e057f20f883e', 1);
   ```

4. 模糊搜索以确定可能需要的权限并获取其 ID：

   ```sql
   SELECT *
   FROM dbo.Roles
   WHERE Name LIKE '%设备%';
   ```

5. 插入权限数据：

   ```sql
   INSERT INTO dbo.UserRoles(UserId, RoleId, State)
   VALUES ('', '', 1);
   ```
