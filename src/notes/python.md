---
title: Python速过文档
icon: fab fa-markdown
order: 2
category:
  - 语言基础
tag:
  - Python
---

**背景知识:Python 的创造者:Guido van Rossum,荷兰人,人称龟叔**

## 语法速过

输出:print() 同类型可+ , 可乘 \*

输入:input('xxx') 先显示提示.再等待用户输入. 输入得类型是字符串.

0x:表示 16 进制,0o:表示 8 进制,0b:表示 2 进制.

数字之间可以使用"\_"分隔时不影响数字.只是为了分隔, 科学计数法表示数字时: 1.2e7

注意它使用也是 IEEE 754 的标准, 0.1+0.2 != 0.3

默认的除法是真实的除法,地板除法://

字符串表示的方法: '' "" '''''' 都可以表示 其中'''''' 可以跨行.

转义: '\' 规则同 C, 不转义:`print(r'xxx')`

与或非: and or not

空值:None

### 字符串方法:

    ord(): 字符转编码值
    chr(): 编码值转字符

    可用\u十六进制的数字 表示某个字符

存到磁盘或者网页上时,就需要转成字节码.

```
encode('ascii') utf-8 等格式. 指定需要编的格式.
decode('') 解码成Unicode,变为可以操作的字符串.解码的方式.
若遇到错误的,就不能解码. 添加errors='ignore' 可以忽略失败的编码.
```

计算字符长度 len()

格式化方法:
`print('value:%d,score:%f'%(7,88.9))`

优雅写法:
print(f'value:{value},score:{score}')

### 列表(list)和元组(tuple)

```python
oneList = ['1','2',3,['s']]
可以套娃
len(oneList): 可以获取list长度.
使用下表取单个值.oneList[0] 从0开始.
逆向从-1 开始,到-len()
往末尾添加元素:append()
插入指定位置元素: insert(index,element)
删除元素:pop(index) 不传是默认末尾元素.
```

```
tuple 不可以修改,使用()表示:
创建时,就会确定下来.无法修改.类似于const 自己不可变,内部值可变,其他同list
oneTuple = (1,2)
空的 oneTuple = ()
一个 oneTuple = (1,) 有点特殊,需要加个,
```

### 条件判断:

```
   if xxx:
      xxx
   else:
      xxx

   if :
   elif :
   else :
```

### 循环结构:

for xx in xxs:
todosometings

搭配 range() 实现次数

range(10) 即 0-9 这 5 个整数. 使用 list()即可转化为列表

     for xx in list(range(10)) 实现循环的次数

while 循环:
条件满足，就不断循环，条件不满足时退出循环

```py
while n > 0:
    sum = sum + n
    n = n - 2
print(sum)
```

break continue 同理.

### dict 和 set

就是 map 键值对组合

```
oneDict = {'Michael': 95, 'Bob': 75, 'Tracy': 85}
```

存取法:
`oneDict['Michael']`

`oneDict['Michael' = 89`

判断字典中是否有某个 key 时:
`ey in oneDict`返回 True 或 False

    方法二: oneDict.get(key,xxx) 第一个参数为key 第二个为没有找到,返回的值.

Set: 就是数学上的集合
使用 list 来生成 set,
oneSet = set([1,2,3])
增: oneSet.add(key)
删: oneSet.remove(key)

可以做交并差补.

## 函数

函数名其实就是指向一个函数对象的引用，完全可以把函数名赋给一个变量，相当于给这个函数起了一个“别名”.

### 定义方式:

    def one_function(x,y=2):
        pass


def 定义函数关键字.

one_function 函数名字.

x,y 形参.后接冒号表示换行.

若未确定函数要执行的事情,先用 pass 占位.

可以返回多个参数.

`return x,y` 实际是返回了一个.只是(x,y)的语法糖.

形参和实参的个数要对上.

形参可以有默认参数: 写法为`y=2`,但是需要学要必要参数的后面.

传递实参时,若是不按照位置去传递.则需要给定名字. 如 `two_function(name = 'xiaoming',sex=0)`

等等,参数还有更多的形式.

### 调用方式:

    函数名(实参1,实参2,...)

执行后的值,是函数内部 return 的值. 可以使用变量接收,作为执行的结果.

return 可以再次调用自己.但是传递不同的参数.来实现递归调用.

    def fact(n):
        if n==1:
            return 1
        return n * fact(n - 1)

递归调用时,需要留有一个缺口,来结束执行. 否则导致死循环.

## 切片

list = [1,2,3,4,5,6,7,8]

[x:y:z]

x:表示开始切的值. 默认为 0.即第一个
y:表示结束的值. 默认是 list 的长度. 因为不包括 y 值得本身.
z:表示隔多个,切一次,默认为 1

负数索引也可以进行切片.最后一位是-1

[-2:] 表示切 list 后两位.
[-2:-1] 表示切倒数第二位.

同理,tuple 与 str 同理,都可以切片.

## 迭代 ()

### 迭代字典:

```
迭代字典的key. 默认就是迭代key
    for key in dic:
        print(key)

迭代字典的value
    for value in dic.values():
        print(value)

同时迭代key 和 value.
    for key,value dic.items():
        print(key,value)

```

字符串,列表,元组同理:

### 判断是否时可迭代对象:

```
    from collections.abc import Iterable
    isinstance(需要判断的对象,Iterable)
```

    如果返回true,则表示是,反之不是.

### 如何实现 C 语言类似的 for 循环.

enumerate() 方法: 将可迭代对象传入,转化成 index 和 value 的形式.

```
for i, value in enumerate(['a','b','c','d','e','f','g']):
    print(i,value)
```
