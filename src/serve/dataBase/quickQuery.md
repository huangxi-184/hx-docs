---
title: sql速查
icon: fab fa-markdown
order: 1
category:
  - sql
tag:
  - sql
---

### SQL 查询组件：

- **WHERE**：查询条件，例如 `WHERE id=1`
- **AS**：别名，例如 `SELECT xxx AS 'yyy'`
- **AND**：连接多个条件
- **IN/NOT IN**：集合查找，例如 `WHERE a IN (1,2)`
- **BETWEEN AND**：区间查找，例如 `WHERE a BETWEEN 1 AND 10`
- **LIMIT**：分页，例如 `LIMIT 0,5`
- **ORDER BY**：排序，可以指定先根据什么升序、如果相等再根据什么降序，例如 `ORDER BY a DESC, b ASC`
- **GROUP BY**：分组，例如 `GROUP BY aaa`
- **HAVING**：分组之后再过滤，例如 `GROUP BY aaa HAVING xxx > 5`
- **DISTINCT**：去重

### SQL 内置函数：

#### 聚合函数：
- `AVG`
- `COUNT`
- `SUM`
- `MIN`
- `MAX`

#### 字符串函数：
- `CONCAT`
- `SUBSTR`
- `LENGTH`
- `UPPER`
- `LOWER`

#### 数值函数：
- `ROUND`
- `CEIL`
- `FLOOR`
- `ABS`
- `MOD`

#### 日期函数：
- `YEAR`
- `MONTH`
- `DAY`
- `DATE`
- `TIME`

#### 条件函数：
- `IF`
- `CASE`

#### 系统函数：
- `VERSION`
- `DATABASE`
- `USER`

#### 类型转换函数：
- `CONVERT`
- `CAST`
- `DATE_FORMAT`
- `STR_TO_DATE`

#### 其他函数：
- `NULLIF`
- `COALESCE`
- `GREATEST`
- `LEAST`