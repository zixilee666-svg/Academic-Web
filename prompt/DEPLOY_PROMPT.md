# Academic Web 部署提示词

## 项目概述

**Academic Web** 是一个基于 EdgeOne Pages 的学术空间管理平台，支持用户注册登录、论文管理、项目管理、文献库等功能。

---

## 一、项目初始化

### 1.1 创建 EdgeOne Pages 项目

```
请在 EdgeOne Pages 控制台创建一个新项目：
- 项目名称：academic-web
- 部署区域：按需选择
- 构建命令：npm run build
- 输出目录：./dist
```

### 1.2 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

---

## 二、前端部署 Prompt

### 2.1 技术栈配置

```
请使用以下技术栈创建前端：
- 框架：React 18 + TypeScript
- 构建工具：Vite
- UI框架：Tailwind CSS
- 路由：React Router v6
- 状态管理：React Context + Hooks
- HTTP客户端：Fetch API

项目结构：
├── src/
│   ├── components/     # 组件
│   ├── pages/          # 页面
│   ├── hooks/          # 自定义Hooks
│   ├── services/       # API服务
│   ├── stores/          # 状态管理
│   └── lib/            # 工具函数
├── public/             # 静态资源
├── dist/               # 构建输出
└── package.json
```

### 2.2 页面组件

```
请创建以下页面组件：

1. 首页 (/)
   - 学术空间画廊展示
   - 搜索和排序功能
   - 登录/注册入口

2. 登录页 (/login)
   - 用户名/密码表单
   - 登录状态管理

3. 注册页 (/register)
   - 用户名、邮箱、密码输入
   - 密码强度验证
   - 表单验证

4. 仪表盘 (/dashboard)
   - 用户统计概览
   - 快捷操作入口
   - 最新活动

5. 论文管理 (/papers)
   - 论文列表展示
   - 创建/编辑/删除论文
   - 标签和分类

6. 项目管理 (/projects)
   - 项目看板视图
   - 进度跟踪
   - 状态管理

7. 文献库 (/libraries)
   - 文献库管理
   - 论文收藏
   - 分类整理

8. 学术空间 (/space/:username)
   - 个人主页展示
   - 学术成果展示
   - 社交链接
```

### 2.3 API 服务配置

```
请配置以下 API 端点：

const API_BASE_URL = '';  // 使用相对路径，通过 Edge Functions 代理

// API 服务
const api = {
  // 认证
  login: (data) => fetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  register: (data) => fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } }),
  logout: () => fetch('/api/auth/logout'),
  getMe: () => fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } }),
  
  // 论文
  getPapers: (username) => fetch(`/api/users/${username}/papers`),
  createPaper: (data) => fetch('/api/papers', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }),
  
  // 项目
  getProjects: (username) => fetch(`/api/users/${username}/projects`),
  createProject: (data) => fetch('/api/projects', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }),
  
  // 文献库
  getLibraries: (username) => fetch(`/api/users/${username}/libraries`),
  createLibrary: (data) => fetch('/api/libraries', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } }),
  
  // 空间
  getSpaces: () => fetch('/api/spaces'),
  getSpace: (username) => fetch(`/api/spaces/${username}`),
}
```

### 2.4 样式配置

```
请配置 Tailwind CSS：

// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#7C3AED',
        accent: '#10B981',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 三、Edge Functions 配置 Prompt

### 3.1 创建 Edge Functions

```
请在 EdgeOne 控制台创建 Edge Functions：
- 函数名称：api
- 描述：Academic Web API Handler
- 路由：/api/*
- 运行环境：Node.js
```

### 3.2 API Handler 代码

```
请实现以下 Edge Functions handler (JavaScript)：

// 主要功能：
1. JWT 认证
2. KV Storage 数据存储
3. CRUD 操作
4. CORS 支持

// 路由：
- POST /api/auth/login     - 用户登录
- POST /api/auth/register  - 用户注册
- GET  /api/auth/me        - 获取当前用户
- GET  /api/spaces         - 获取所有空间
- GET  /api/spaces/:username - 获取特定空间
- GET  /api/users/:username/papers - 获取用户论文
- POST /api/papers         - 创建论文
- GET  /api/users/:username/projects - 获取用户项目
- POST /api/projects       - 创建项目
- GET  /api/users/:username/libraries - 获取用户文献库
- POST /api/libraries      - 创建文献库
```

### 3.3 KV Storage 配置

```
请在 EdgeOne 控制台：
1. 创建 KV 命名空间：academic_hub_kv
2. 绑定到 Edge Functions
3. 设置变量名：ACADEMIC_HUB_KV
```

---

## 四、部署配置 Prompt

### 4.1 pages.config.json

```
请创建 pages.config.json：

{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "./dist",
  "routes": [
    {
      "path": "/api/*",
      "target": "./edge-functions"
    },
    {
      "path": "/*",
      "target": "./dist"
    }
  ],
  "edgeFunctions": {
    "routes": [
      {
        "src": "/api/(.*)",
        "dest": "/api/index.js"
      }
    ]
  },
  "envVariables": {
    "JWT_SECRET": "your-jwt-secret-key-min-32-chars",
    "KV_STORAGE_ID": "your-kv-storage-id"
  },
  "site": {
    "icp": {
      "number": "粤ICP备XXXXXXXX号-X",
      "link": "https://beian.miit.gov.cn/"
    }
  }
}
```

### 4.2 环境变量

```
请在 EdgeOne 控制台设置以下环境变量：
- JWT_SECRET: JWT加密密钥（至少32字符）
- KV_STORAGE_ID: KV存储命名空间ID
```

---

## 五、功能清单

### 5.1 用户功能

```
✓ 用户注册（用户名、邮箱、密码）
✓ 用户登录（JWT Token）
✓ 用户登出
✓ 个人资料编辑
✓ 学术空间展示
```

### 5.2 论文管理

```
✓ 创建论文（标题、摘要、作者、年份、期刊、标签）
✓ 编辑论文
✓ 删除论文
✓ 论文搜索和筛选
✓ 引用计数
```

### 5.3 项目管理

```
✓ 创建项目（名称、描述、状态、进度）
✓ 更新项目进度
✓ 项目状态管理
✓ 项目标签
```

### 5.4 文献库

```
✓ 创建文献库
✓ 添加论文到文献库
✓ 移除论文
✓ 文献库分类
```

### 5.5 系统功能

```
✓ 管理员后台
✓ 数据统计
✓ 备案信息展示
```

---

## 六、部署检查清单

```
□ 创建 EdgeOne Pages 项目
□ 配置构建命令和输出目录
□ 创建 KV Storage 命名空间
□ 绑定 KV 到 Edge Functions
□ 设置环境变量
□ 配置 API 路由
□ 配置 CORS
□ 设置备案信息
□ 部署前端代码
□ 部署 Edge Functions
□ 测试登录注册
□ 测试数据 CRUD
□ 验证部署成功
```

---

## 七、测试账号

```
管理员：admin / 123456
演示用户：joan / 11223344
```

---

## 八、相关文档

- [EdgeOne Pages 文档](https://edgeone.pages.dev/)
- [KV Storage 文档](https://edgeone.pages.dev/features/kv-storage)
- [Edge Functions 文档](https://edgeone.pages.dev/features/edge-functions)
