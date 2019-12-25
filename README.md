# h5单页开发的模板
本模板配合 `varied-cli` 使用，利用 `varied-cli` 快速构建h5单页开发工程。

### 安装

```
npm install varied-cli -g
```
### 构建方法

```
varied init webpack mytest
```

## 自定义可配置项
* 添加内网 `sourceMap`
  在 `config/index.js` 文件中配置生产环境下内网sourceMap地址


## 项目技术栈

| 构成         | 框架    |
| ------------ | ------- |
| 前端视图页面 | vue     |
| 工程化       | webpack |

## 项目本地运行

```
npm install
npm run start
```

## 项目构建

```
// 开发环境构建
npm run dev
// 生产环境构建
npm run build
```
