# 岩土识别后端服务 - 部署指南

## 快速部署方案

### 方案1：Railway（推荐，免费）

1. **创建Railway账号**：https://railway.app

2. **上传代码到GitHub**：
   ```bash
   cd server
   git init
   git add .
   git commit -m "init"
   git remote add origin https://github.com/YOUR_USERNAME/geoidentify-server.git
   git push -u origin main
   ```

3. **在Railway创建项目**：
   - 登录Railway，选择"Deploy from GitHub repo"
   - 选择刚创建的仓库
   - Railway会自动检测Node.js项目

4. **配置环境变量**：
   - `PORT`: 9091
   - `NODE_ENV`: production

5. **获取部署URL**：
   - 部署完成后，Railway会提供URL，如：`https://geoidentify-server.up.railway.app`

6. **更新APK配置**：
   - 修改 `client/app.config.ts` 中的 `backendUrl` 为你的Railway URL
   - 重新打包APK

### 方案2：Render（免费）

1. **创建Render账号**：https://render.com

2. **创建Web Service**：
   - 连接GitHub仓库
   - 设置：
     - Root Directory: `server`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

3. **获取URL**：如 `https://geoidentify-server.onrender.com`

### 方案3：阿里云/腾讯云 ECS

1. **购买云服务器**（最低配即可）

2. **安装Node.js**：
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **上传代码**：
   ```bash
   scp -r server user@your-server:/path/to/deploy/
   ```

4. **安装依赖并运行**：
   ```bash
   cd server
   npm install
   npm run build
   npm start
   ```

5. **配置Nginx反向代理**（可选）：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:9091;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

## 验证部署

部署完成后，测试API是否正常：

```bash
curl https://your-backend-url.com/api/v1/health
```

应返回：
```json
{"status":"ok","timestamp":"..."}
```

## 常见问题

### 1. CORS跨域问题
后端已配置CORS允许所有来源，如仍有问题检查：
- 防火墙是否开放9091端口
- 云服务器安全组是否允许入站流量

### 2. 文件上传失败
检查服务器磁盘空间和上传目录权限：
```bash
mkdir -p server/uploads
chmod 755 server/uploads
```

### 3. 依赖安装失败
清理缓存后重试：
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```
