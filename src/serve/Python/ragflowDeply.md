---
title: ragFlow部署模型问题总结
icon: fab fa-markdown
order: 4
category:
  - 部署
tag:
  - 部署
---

1. Python使用paramiko库进行远程的SSH代码连接时,服务器上有conda环境,却无法识别对应的指令.
解决办法如下:
    直接使用虚拟环境的绝对路径去启动
```sh
    conda_path = "/home/hcs2/miniconda3/condabin/conda"
    HF_MIRROR = "https://hf-mirror.com"
    env_vars = [
        f"HF_ENDPOINT={HF_MIRROR}",
        f"HF_HUB_ENDPOINT={HF_MIRROR}"
    ]
    env_prefix = " ".join(env_vars) + " "
    command_parts = [f"{conda_path} run -n vllm {env_prefix} vllm serve {model}"]
```

2. 部署AI时,需要从HuggingFace下载模型,却无法连接到网络.
解决办法如下:
    在拼接shell脚本时,直接拼接上镜像源.修改代码如上

3. 无法读取到远程shell脚本执行的文件
解决办法如下:
```sh
暂无
```

4.部署成功后,但是无法从外界访问.需要开通服务器的防火墙端口
```sh
sudo ufw allow 8080/tcp

开启后通过powershell执行下面的命令,测试是否成功.
Test-NetConnection -ComputerName 172.31.20.231 -Port 8080
```

5.完成部署后,需要构建对话页,验证是否部署成功.
```py
# 有以下问题
# 1. 需要部署完成后,自动添加模型到系统列表中.
# 2. 新增一个模型对话,然后填入对应的测试模型参数,最后得到对话id
```