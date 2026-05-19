import express from "express";
import multer from "multer";
import { FetchClient, Config } from "coze-coding-dev-sdk";

const router = express.Router();

// 配置 multer 用于接收图片
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB 限制
});

// 矿物数据库
const minerals = [
  {
    id: 1,
    name: "花岗岩",
    englishName: "Granite",
    category: "火成岩",
    color: "灰白色、粉红色",
    texture: "粗粒、结晶质",
    origin: "岩浆侵入",
    hardness: "Mohs 6-7",
    description: "花岗岩是一种粗粒火成岩，主要由石英、长石和云母组成。它是地壳中最常见的岩石之一，具有高硬度和耐久性，广泛用于建筑和装饰材料。",
    applications: ["建筑材料", "装饰石材", "道路铺设", "雕塑原料"],
    confidence: 0.968
  },
  {
    id: 2,
    name: "石灰岩",
    englishName: "Limestone",
    category: "沉积岩",
    color: "灰色、棕黄色",
    texture: "层状、碎屑",
    origin: "化学沉积",
    hardness: "Mohs 3-4",
    description: "石灰岩是一种沉积岩，主要由方解石组成。它通常形成于浅海环境，广泛用于建筑、水泥生产和钢铁冶炼。",
    applications: ["水泥生产", "建筑材料", "炼钢熔剂", "雕刻材料"],
    confidence: 0.923
  },
  {
    id: 3,
    name: "玄武岩",
    englishName: "Basalt",
    category: "火成岩",
    color: "深灰色、黑色",
    texture: "细粒、隐晶质",
    origin: "火山喷发",
    hardness: "Mohs 6-7",
    description: "玄武岩是一种细粒火成岩，由火山喷发的岩浆快速冷却形成。它分布广泛，是月球表面最常见的岩石类型。",
    applications: ["道路材料", "建筑石材", "园林景观", "铸石材料"],
    confidence: 0.941
  },
  {
    id: 4,
    name: "砂岩",
    englishName: "Sandstone",
    category: "沉积岩",
    color: "棕色、红色、黄色",
    texture: "碎屑、粒状",
    origin: "机械沉积",
    hardness: "Mohs 6-7",
    description: "砂岩是一种碎屑沉积岩，由砂粒胶结而成。它记录了古代沉积环境的信息，常用于建筑和磨料。",
    applications: ["建筑材料", "玻璃原料", "石油储层", "雕刻材料"],
    confidence: 0.895
  },
  {
    id: 5,
    name: "大理岩",
    englishName: "Marble",
    category: "变质岩",
    color: "白色、灰色、彩色",
    texture: "结晶、块状",
    origin: "区域变质",
    hardness: "Mohs 3-4",
    description: "大理岩是石灰岩经变质作用形成的结晶岩石，主要由方解石或白云石组成。它质地细腻，色彩美观，是著名的装饰石材。",
    applications: ["装饰石材", "雕塑材料", "建筑材料", "工业填料"],
    confidence: 0.917
  },
  {
    id: 6,
    name: "页岩",
    englishName: "Shale",
    category: "沉积岩",
    color: "灰色、黑色",
    texture: "泥质、层状",
    origin: "化学沉积",
    hardness: "Mohs 2-3",
    description: "页岩是一种细粒沉积岩，由黏土矿物胶结而成。它具有独特的层理结构，是石油和天然气的重要源岩。",
    applications: ["石油天然气", "陶瓷原料", "建筑材料", "土壤改良"],
    confidence: 0.876
  },
  {
    id: 7,
    name: "石英",
    englishName: "Quartz",
    category: "矿物",
    color: "无色、白色、紫色",
    texture: "结晶",
    origin: "岩浆结晶",
    hardness: "Mohs 7",
    description: "石英是地壳中分布最广的矿物之一，化学成分为二氧化硅。它具有极高的硬度和稳定性，用途广泛。",
    applications: ["玻璃原料", "电子器件", "珠宝首饰", "研磨材料"],
    confidence: 0.956
  },
  {
    id: 8,
    name: "云母",
    englishName: "Mica",
    category: "矿物",
    color: "银色、金色、绿色",
    texture: "片状",
    origin: "岩浆结晶",
    hardness: "Mohs 2-2.5",
    description: "云母是一族层状硅酸盐矿物的总称，具有独特的片状结构和珍珠光泽。它在电子工业中有重要应用。",
    applications: ["电子材料", "绝缘材料", "化妆品", "涂料填料"],
    confidence: 0.889
  }
];

// 存储识别历史（内存存储，生产环境应使用数据库）
const history: any[] = [];

// 图片识别接口
router.post('/identify', upload.single('image'), async (req: express.Request, res: express.Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: '请上传图片' });
      return;
    }

    // 模拟AI识别 - 实际项目中这里应该调用WGAN模型或第三方识别API
    // 随机选择一个矿物作为识别结果
    const randomIndex = Math.floor(Math.random() * minerals.length);
    const result = minerals[randomIndex];
    
    // 生成一个随机的置信度 (85%-99%)
    const confidence = (0.85 + Math.random() * 0.14).toFixed(2);
    
    // 生成次要候选
    const candidates = minerals
      .filter(m => m.id !== result.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map(m => ({
        id: m.id,
        name: m.name,
        englishName: m.englishName,
        confidence: (0.01 + Math.random() * 0.05).toFixed(2)
      }));

    const record = {
      id: Date.now(),
      imageUrl: `/uploads/${req.file.filename}`,
      result: {
        ...result,
        confidence: parseFloat(confidence)
      },
      candidates,
      createdAt: new Date().toISOString()
    };

    // 保存到历史记录
    history.unshift(record);

    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('识别错误:', error);
    res.status(500).json({ error: '识别失败，请重试' });
  }
});

// 获取识别历史
router.get('/history', (req: express.Request, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const start = (page - 1) * limit;
  const end = start + limit;
  
  res.json({
    success: true,
    data: {
      list: history.slice(start, end),
      total: history.length,
      page,
      limit
    }
  });
});

// 获取单条识别记录
router.get('/history/:id', (req: express.Request, res: express.Response) => {
  const id = parseInt(req.params.id as string);
  const record = history.find(h => h.id === id);
  
  if (!record) {
    res.status(404).json({ error: '记录不存在' });
    return;
  }
  
  res.json({
    success: true,
    data: record
  });
});

// 获取支持的矿物列表
router.get('/minerals', (req: express.Request, res: express.Response) => {
  res.json({
    success: true,
    data: minerals.map(m => ({
      id: m.id,
      name: m.name,
      englishName: m.englishName,
      category: m.category
    }))
  });
});

// 获取矿物详情
router.get('/minerals/:id', (req: express.Request, res: express.Response) => {
  const id = parseInt(req.params.id as string);
  const mineral = minerals.find(m => m.id === id);
  
  if (!mineral) {
    res.status(404).json({ error: '矿物不存在' });
    return;
  }
  
  res.json({
    success: true,
    data: mineral
  });
});

// 删除历史记录
router.delete('/history/:id', (req: express.Request, res: express.Response) => {
  const id = parseInt(req.params.id as string);
  const index = history.findIndex(h => h.id === id);
  
  if (index === -1) {
    res.status(404).json({ error: '记录不存在' });
    return;
  }
  
  history.splice(index, 1);
  
  res.json({
    success: true,
    message: '删除成功'
  });
});

// 收藏/取消收藏
router.post('/favorite/:id', (req: express.Request, res: express.Response) => {
  const id = parseInt(req.params.id as string);
  const record = history.find(h => h.id === id);
  
  if (!record) {
    res.status(404).json({ error: '记录不存在' });
    return;
  }
  
  record.favorited = !record.favorited;
  
  res.json({
    success: true,
    data: { favorited: record.favorited }
  });
});

export default router;
