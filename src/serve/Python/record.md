---
title: 评估指令与记录
icon: fab fa-markdown
order: 5
category:
  - 模型评估
tag:
  - 模型评估
---

# 📊 模型评估指令与记录

<RichCardGrid>
<RichCard title="评估指令" icon="fas:terminal">
评估模型时使用的命令和配置参数
</RichCard>
<RichCard title="评估记录" icon="fas:chart-bar">
模型评估的结果记录和数据分析
</RichCard>
</RichCardGrid>

## 🎯 评估指令

### 漏洞检测与修复模型评估指令

```sh
evalscope eval \
  --work-dir /home/test/llm-eval/eval-outputs/99一次性过/漏洞检测与修复甲乙丙 \
  --model XingYun-Vul-72B \
  --api-url http://192.168.63.100:8586/v1/chat/completions \
  --api-key 1 \
  --datasets vuln_evaluate_third vuln_evaluate_accept vuln_repair_evaluate_third vuln_repair_evaluate_accept vuln_evaluate vuln_repair_evaluate \
  --eval-type openai_api \
  --generation-config '{"temperature": 0, "max_new_tokens": 8192}'
```

### 缺陷检测与修复模型评估指令

```sh
evalscope eval \
  --work-dir /home/test/llm-eval/eval-outputs/99一次性过/缺陷检测与修复甲乙丙 \
  --model XingYun-72B \
  --api-url http://192.168.68.75:8080/generation/v1 \
  --api-key 1 \
  --datasets defect_evaluate defect_evaluate_third defect_evaluate_accept defect_repair_evaluate defect_repair_evaluate_third defect_repair_evaluate_accept \
  --eval-type openai_api \
  --generation-config '{"temperature": 0, "max_new_tokens": 8192}'
```

## 📓 学习记录

<RichCardGrid>
<RichCard title="基础知识" icon="fas:book">
Python 基础语法和概念
</RichCard>
<RichCard title="进阶内容" icon="fas:graduation-cap">
面向对象、装饰器等高级特性
</RichCard>
<RichCard title="实战项目" icon="fas:project-diagram">
实际项目经验和代码示例
</RichCard>
</RichCardGrid>

## 📈 评估记录

### 2025年12月10日 早晨记录 (vLLM 版本: v0.10.0)

#### 漏洞检测评估结果

##### vuln_evaluate_third 报告
```
+-----------------+---------------------+---------------+----------+-------+---------+---------+
| Model           | Dataset             | Metric        | Subset   |   Num |   Score | Cat.0   |
+=================+=====================+===============+==========+=======+=========+=========+
| XingYun-Vul-72B | vuln_evaluate_third | mean_accuracy | default  |   600 |  0.9317 | default |
+-----------------+---------------------+---------------+----------+-------+---------+---------+
```

##### vuln_evaluate_accept 报告
```
+-----------------+----------------------+---------------+----------+-------+---------+---------+
| Model           | Dataset              | Metric        | Subset   |   Num |   Score | Cat.0   |
+=================+======================+===============+==========+=======+---------+---------+
| XingYun-Vul-72B | vuln_evaluate_accept | mean_accuracy | default  |   600 |    0.93 | default |
+-----------------+----------------------+---------------+----------+-------+---------+---------+
```

#### 漏洞修复评估结果

##### vuln_repair_evaluate_third 报告
```
+-----------------+----------------------------+---------------+----------+-------+---------+---------+
| Model           | Dataset                    | Metric        | Subset   |   Num |   Score | Cat.0   |
+=================+============================+===============+==========+=======+=========+=========+
| XingYun-Vul-72B | vuln_repair_evaluate_third | mean_accuracy | default  |   500 |   0.912 | default |
+-----------------+----------------------------+---------------+----------+-------+---------+---------+
```
+-----------------+----------------------------+---------------+----------+-------+---------+---------+