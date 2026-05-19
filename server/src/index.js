import express from "express";
import cors from "cors";
import fetchRouter from "./routes/fetch";
import identifyRouter from "./routes/identify";
import path from "path";
import fs from "fs";
const app = express();
const port = process.env.PORT || 9091;
// 确保上传目录存在
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// 静态文件服务
app.use('/uploads', express.static(uploadDir));
app.get('/api/v1/health', (req, res) => {
    console.log('Health check success');
    res.status(200).json({ status: 'ok' });
});
// Fetch URL endpoint
app.use('/api/v1/fetch', fetchRouter);
// 矿物识别 endpoint
app.use('/api/v1/identify', identifyRouter);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}/`);
});
