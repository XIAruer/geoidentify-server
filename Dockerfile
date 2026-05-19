FROM node:20-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装所有依赖（包括 devDependencies 用于构建）
RUN npm install

# 复制源代码
COPY . .

# 编译 TypeScript
RUN npm run build

# 启动服务
CMD ["npm", "start"]
