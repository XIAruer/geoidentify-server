import express from "express";
import { FetchClient, Config } from "coze-coding-dev-sdk";
const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            res.status(400).json({ error: 'URL is required' });
            return;
        }
        const config = new Config();
        const client = new FetchClient(config);
        const response = await client.fetch(url);
        res.json({
            status_code: response.status_code,
            status_message: response.status_message,
            url: response.url,
            title: response.title,
            content: response.content,
        });
    }
    catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch URL' });
    }
});
export default router;
