# AI 写作助手 (AI Writing Assistant)

## 一、项目概述

构建一个基于 AI 的在线写作助手平台，支持文章创作、润色、翻译、摘要提取等功能。

## 二、技术架构

### 前端
- **框架**: 纯 HTML + CSS + JavaScript（单页应用）
- **UI 库**: Tailwind CSS + 自定义深色主题
- **特性**: Markdown 实时预览、代码高亮、深色/浅色主题切换

### 后端
- **平台**: 腾讯云 EdgeOne Pages
- **API**: Edge Functions（支持 CORS）
- **存储**: KV Storage（用户数据、创作记录）
- **认证**: JWT Token

### AI 集成
- **接口**: Cloud Studio API（流式响应）
- **功能**: 写作润色、翻译、摘要、续写

## 三、功能模块

### 核心功能
1. **智能写作**
   - 主题生成文章
   - 大纲自动生成
   - 内容续写

2. **润色工具**
   - 语法检查
   - 表达优化
   - 文风调整（正式/轻松/学术）

3. **翻译助手**
   - 多语言互译
   - 保持原意
   - 文化适配

4. **摘要提取**
   - 长文摘要
   - 关键点提取
   - TL;DR 生成

### 用户系统
- 邮箱注册/登录
- 创作历史记录
- 收藏夹功能

## 四、数据结构 (KV Storage)

```json
{
  "user:{userId}": {
    "id": "string",
    "email": "string",
    "password": "string",
    "nickname": "string",
    "avatar": "string",
    "role": "user|pro",
    "createdAt": "ISO8601",
    "settings": {
      "theme": "dark|light",
      "defaultLang": "zh|en",
      "aiModel": "string"
    }
  },
  "article:{articleId}": {
    "id": "string",
    "userId": "string",
    "title": "string",
    "content": "string",
    "type": "original|polish|translate|summary",
    "sourceLang": "string",
    "targetLang": "string",
    "tags": ["string"],
    "status": "draft|published",
    "createdAt": "ISO8601",
    "updatedAt": "ISO8601"
  },
  "favorites:{userId}": ["articleId"],
  "session:{token}": {
    "userId": "string",
    "expiresAt": "ISO8601"
  }
}
```

## 五、API 接口设计

### 用户接口
- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录
- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/settings` - 更新用户设置

### AI 写作接口
- `POST /api/ai/write` - 生成文章
- `POST /api/ai/polish` - 润色文章
- `POST /api/ai/translate` - 翻译内容
- `POST /api/ai/summary` - 摘要提取

### 内容管理接口
- `GET /api/articles` - 获取文章列表
- `POST /api/article` - 创建文章
- `PUT /api/article/:id` - 更新文章
- `DELETE /api/article/:id` - 删除文章
- `POST /api/article/:id/favorite` - 收藏文章

## 六、部署步骤

### 1. 准备静态资源

创建前端文件结构：
```
ai-writer-app/
├── index.html          # 主页面
├── css/
│   └── styles.css      # 样式文件
├── js/
│   ├── app.js          # 主应用逻辑
│   ├── api.js          # API 调用
│   ├── auth.js         # 认证模块
│   └── ai.js           # AI 功能模块
├── assets/
│   └── icons/          # 图标资源
└── manifest.json       # PWA 配置
```

### 2. 配置文件

创建 `pages.config.json`：
```json
{
  "version": 2,
  "routes": [
    {
      "route": "/api/*",
      "target": "function",
      "function": "ai-writer-api"
    },
    {
      "route": "/*",
      "target": "static"
    }
  ],
  "functions": {
    "ai-writer-api": {
      "runtime": "nodejs18",
      "entry": "functions/api/index.js"
    }
  },
  "kvNamespaces": [
    {
      "id": "ai-writer-kv",
      "variables": ["AI_WRITER_KV"]
    }
  ],
  "envVariables": [
    {
      "variableName": "JWT_SECRET",
      "value": "your-jwt-secret-key"
    },
    {
      "variableName": "AI_API_TOKEN",
      "value": "your-cloud-studio-token"
    }
  ]
}
```

### 3. 部署到 EdgeOne Pages

```bash
# 安装 CLI
npm install -g @cloudflare/edgeone-pages

# 登录
edgeone-pages login

# 创建项目
edgeone-pages project create ai-writer-app

# 部署
edgeone-pages deploy --directory ./ai-writer-app
```

### 4. KV Storage 配置

1. 在 EdgeOne 控制台创建 KV 命名空间：`ai-writer-kv`
2. 绑定到 Edge Functions
3. 导入初始数据（可选）

### 5. 环境变量配置

| 变量名 | 说明 | 示例 |
|--------|------|------|
| JWT_SECRET | JWT 加密密钥 | 至少32位字符 |
| AI_API_TOKEN | Cloud Studio API 令牌 | 获取自集成 |

## 七、认证流程

1. 用户注册 → 存储用户信息到 KV
2. 用户登录 → 生成 JWT Token
3. Token 存储到 session KV，设置过期时间
4. API 请求携带 Token，Edge Functions 验证
5. 登出 → 删除 session

```javascript
// JWT 生成
const token = await signJwt({ userId, exp: Date.now() + 7*24*60*60*1000 }, JWT_SECRET);

// JWT 验证
const payload = await verifyJwt(token, JWT_SECRET);
```

## 八、AI 集成方式

### 方式一：Cloud Studio API（推荐）

```javascript
async function callAI(prompt, options = {}) {
  const response = await fetch('https://api.cloud.studio/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.AI_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: options.model || 'pro',
      messages: [{ role: 'user', content: prompt }],
      stream: options.stream || false,
      temperature: options.temperature || 0.7
    })
  });
  return response.json();
}
```

### 方式二：自定义 AI 服务

修改 `edge-functions/api/ai.js` 中的 AI 调用逻辑：

```javascript
async function callAICustom(prompt, config) {
  const { endpoint, apiKey, model } = config;
  // 实现自定义 AI 调用
}
```

## 九、测试验证

### 测试账号
- 邮箱: `test@example.com`
- 密码: `test123456`

### 验证清单

- [ ] 页面正常加载，无控制台错误
- [ ] 用户注册成功，数据存储到 KV
- [ ] 用户登录成功，获取 JWT Token
- [ ] AI 写作功能正常返回
- [ ] 文章 CRUD 操作正常
- [ ] 收藏功能正常
- [ ] 深色/浅色主题切换正常

## 十、性能优化

1. **CDN 加速**: 静态资源通过 EdgeOne CDN 分发
2. **缓存策略**: KV 数据设置合理 TTL
3. **流式响应**: AI 生成使用流式输出
4. **代码分割**: 按需加载功能模块

## 十一、安全考虑

1. 密码使用 bcrypt 加密存储
2. JWT Token 设置短期过期
3. API 速率限制（防滥用）
4. 输入内容过滤和转义
5. CORS 严格配置

## 十二、扩展功能

- [ ] 支持团队协作
- [ ] AI 生成图片配图
- [ ] 多语言界面
- [ ] Chrome 扩展插件
- [ ] API 开放平台
