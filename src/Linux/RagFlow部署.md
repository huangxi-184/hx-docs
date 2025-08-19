## RagFlow部署文档

1. 检查vm.max_map_count的值
```sh
sysctl vm.max_map_count
# 如果小于262144,执行第二句
sudo sysctl -w vm.max_map_count=262144
# 每次重启服务器后会归零
```


2. git clone 代码

```sh
git clone https://github.com/infiniflow/ragflow.git
cd ragflow/
```

3. 安装pipx
```sh
sudo apt install pipx
```