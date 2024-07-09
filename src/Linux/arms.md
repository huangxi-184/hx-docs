---
title: 应用实时监控服务ARMS
shortTitle: 实时监控服务ARMS
icon: fab fa-markdown
isOriginal: true
date: 2023-12-28
order: 1
category:
  - ARMS
tag:
  - ARMS
---

# 阿里云实时监控服务 (ARMS)

## 用户体验监控

### 监控内容

ARMS前端监控专注于对Web场景、Weex场景和小程序场景的监控，主要从以下三个方面监测页面的健康度：

- **页面打开速度**（测速）
- **页面稳定性**（JS诊断错误）
- **外部服务调用成功率**（API）

通过这些监控，您可以统计每个月面的访问量、直达人均访问次数和访问用户数量。

常规使用:
1.npm的方式接入探针
```shell
npm install @arms/rum-miniapp
```

2. 在入口文件中引入探针(即可初始化完成)
```js
import ArmsRum from '@arms/rum-miniapp';

ArmsRum.init({
  pid: "your app id",
  endpoint: "your endpint"
});
```

常用配置项：
```ts
// 异常收集
import RumLogger from '@arms/rum-miniapp';

const getEnv = () => {
	let env = 'prod';
	const {
		miniProgram: {
			envVersion
		}
	} = uni.getAccountInfoSync();

	switch (envVersion) {
		case 'develop':
			env = 'local'
			break;
		case 'trial':
			env = 'pre'
			break;
		case 'release':
			env = 'prod'
			break;
	}
	return env
}


const getVersion = () => {
	const {
		miniProgram: {
			version
		}
	} = uni.getAccountInfoSync();
	console
	return version
}

const rumLoggerOptions = {
	pid: 'xxxx',
	endpoint: 'https://daymhpej7q-default-cn.rum.aliyuncs.com',
	version: getVersion() || '0.0.1',
	user: {
		name: uni.getStorageSync('userName'),
		tags: uni.getStorageSync('staffCode')
	},
	env: getEnv()
}

export const startRum = () => {
	RumLogger.init(rumLoggerOptions);
}
```

3. 将当前应用对应的endpoint地址添加到服务器域名白名单中
   

### 监控指标

- **可见检测 session 数**
- **PV（Page View）数量**
- **UV（Unique Visitor）数量**
- **资源数**
- **API 请求数量**
- **异常数量**

## SDK 使用

ARMS提供的SDK可以监听以下事件：

- **API**
- **jsError**
- **consoleError**
- **action**

并且可以设置上报时间间隔和收集内容。

### SDK API

#### 获取SDK配置

```javascript
ArmsRum.getConfig();
```

#### 修改SDK配置

```javascript
// 指定 key 设置
ArmsRum.setConfig('env', 'pre');

// 覆盖设置
const config = ArmsRum.getConfig();
ArmsRum.setConfig({
  ...config,
  version: '1.0.0',
  env: 'pre',
});
```

#### 上报自定义数据

```javascript
ArmsRum.sendCustom(data);

ArmsRum.sendCustom({
  type: 'CustomEvnetType1',
  name: 'customEventName2',
  group: 'customEventGroup3',
  value: 111.11
});
```

#### 上报自定义异常数据

```javascript
ArmsRum.sendException(exception);

ArmsRum.sendCustom({
  // 必选
  name: 'customErrorName',
  message: 'custom error message',
  // 可选
  file: 'custom exception filename',
  stack: 'custom exception error.stack',
  line: 1,
  column: 2
});
```

#### 上报自定义资源

```javascript
ArmsRum.sendResource(resource);
ArmsRum.sendResource({
  // 必选
  name: 'getListByPage',
  message: 'success',
  duration: 800,
  // 可选
  url: 'https://www.aliyun.com/data/getListByPage',
});
```

## 参考文档

更多详细信息，请参阅[阿里云ARMS用户体验监控文档](https://help.aliyun.com/zh/arms/user-experience-monitoring/access-applet?spm=a2c4g.11186623.0.0.5a8a3058dWQWGA)。
