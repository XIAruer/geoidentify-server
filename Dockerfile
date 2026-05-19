# Dockerfile for 岩土识别后端服务
FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖（包括开发依赖，因为需要tsx编译）
RUN npm install

# 复制源代码
COPY tsconfig.json ./
COPY src ./src

# 编译 TypeScript
RUN npm run build

# 复制编译输出到正确位置
RUN mkdir -p dist && cp -r src/* dist/ || true

# 重新安装生产依赖
RUN npm install --production

# 暴露端口
EXPOSE 9091

# 启动命令
CMD ["node", "dist/index.js"]
