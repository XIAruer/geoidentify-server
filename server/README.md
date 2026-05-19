# 岩土识别后端服务

基于Express.js的岩土矿物智能识别API服务。

## 功能

- 岩石矿物图片AI识别
- 识别结果历史记录管理
- 支持拍照和相册图片上传

## API端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/v1/health | 健康检查 |
| POST | /api/v1/identify | 上传图片识别 |
| GET | /api/v1/history | 获取识别历史 |
| DELETE | /api/v1/history/:id | 删除历史记录 |
| POST | /api/v1/history/:id/favorite | 收藏/取消收藏 |

## 部署

本项目已配置为可在Railway上一键部署。

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

## 本地运行

```bash
npm install
npm run build
npm start
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务端口 | 9091 |
| NODE_ENV | 运行环境 | production |
