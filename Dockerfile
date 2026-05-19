# Dockerfile for 岩土识别后端服务
FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制源代码
COPY dist ./dist

# 暴露端口
EXPOSE 9091

# 启动命令
CMD ["node", "dist/index.js"]
