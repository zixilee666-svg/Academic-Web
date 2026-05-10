# Academic Web 部署提示词 - 机甲风格

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

```javascript
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

### 2.4 样式配置 - 机甲风格

```javascript
// tailwind.config.js - 机甲风格配色方案
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 机甲主色调 - 深空黑与电光蓝
        primary: '#00D9FF',      // 电光青 - 主强调色
        'primary-dark': '#0099CC', // 深海蓝 - 深色变体
        secondary: '#FF6B00',     // 警示橙 - 次要强调
        'secondary-dark': '#CC5500', // 暗橙 - 深色变体
        accent: '#00FF88',        // 霓虹绿 - 成功状态
        
        // 机甲金属质感
        metal: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#1E3A5F',  // 深空蓝 - 主要背景
          900: '#0A1929', // 纯黑 - 深层背景
          950: '#000000', // 绝对黑
        },
        
        // 机甲能量色
        energy: {
          cyan: '#00D9FF',
          orange: '#FF6B00',
          green: '#00FF88',
          red: '#FF3366',
          yellow: '#FFD700',
        },
        
        // 表面颜色
        surface: {
          primary: '#0D1B2A',   // 主表面 - 深空蓝
          secondary: '#1B263B', // 次表面
          tertiary: '#2D3E50',  // 第三表面
          elevated: '#415A77',  // 提升表面
        },
      },
      fontFamily: {
        display: ['Orbitron', 'Rajdhani', 'sans-serif'], // 机甲风格字体
        mono: ['Share Tech Mono', 'Consolas', 'monospace'], // 终端字体
        sans: ['Rajdhani', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.5)',
        'glow-orange': '0 0 20px rgba(255, 107, 0, 0.5)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(0, 217, 255, 0.1)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 217, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.8), 0 0 30px rgba(0, 217, 255, 0.4)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(to right, rgba(0, 217, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 217, 255, 0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
```

---

## 三、机甲风格 CSS 变量

```css
/* 机甲风格全局 CSS 变量 */
:root {
  /* 主色调 */
  --mecha-primary: #00D9FF;
  --mecha-primary-dark: #0099CC;
  --mecha-secondary: #FF6B00;
  --mecha-accent: #00FF88;
  
  /* 金属质感 */
  --mecha-metal-dark: #0A1929;
  --mecha-metal: #1B263B;
  --mecha-metal-light: #415A77;
  
  /* 能量色 */
  --mecha-energy-cyan: #00D9FF;
  --mecha-energy-orange: #FF6B00;
  --mecha-energy-green: #00FF88;
  --mecha-energy-red: #FF3366;
  
  /* 背景 */
  --mecha-bg-primary: #050A12;
  --mecha-bg-secondary: #0D1B2A;
  --mecha-bg-surface: #1B263B;
  
  /* 文字 */
  --mecha-text-primary: #E0E6ED;
  --mecha-text-secondary: #9FB3C8;
  --mecha-text-accent: #00D9FF;
  
  /* 发光效果 */
  --mecha-glow-cyan: 0 0 10px rgba(0, 217, 255, 0.5);
  --mecha-glow-orange: 0 0 10px rgba(255, 107, 0, 0.5);
  --mecha-border-glow: inset 0 0 10px rgba(0, 217, 255, 0.1);
}

/* 机甲风格深色主题 */
.dark {
  --mecha-bg: var(--mecha-bg-primary);
  --mecha-surface: var(--mecha-bg-secondary);
  --mecha-border: rgba(0, 217, 255, 0.2);
}
```

---

## 四、Edge Functions 配置 Prompt

### 4.1 创建 Edge Functions

```
请在 EdgeOne 控制台创建 Edge Functions：
- 函数名称：api
- 描述：Academic Web API Handler
- 路由：/api/*
- 运行环境：Node.js
```

### 4.2 API Handler 代码

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

### 4.3 KV Storage 配置

```
请在 EdgeOne 控制台：
1. 创建 KV 命名空间：academic_hub_kv
2. 绑定到 Edge Functions
3. 设置变量名：ACADEMIC_HUB_KV
```

---

## 五、部署配置 Prompt

### 5.1 pages.config.json

```json
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
    "JWT_SECRET": "mecha-jwt-secret-alpha-2026-cybernetic",
    "KV_STORAGE_ID": "mecha-kv-storage-id"
  },
  "site": {
    "icp": {
      "number": "粤ICP备XXXXXXXX号-X",
      "link": "https://beian.miit.gov.cn/"
    }
  }
}
```

### 5.2 环境变量

```
请在 EdgeOne 控制台设置以下环境变量：
- JWT_SECRET: 机甲风格JWT加密密钥（至少32字符）
- KV_STORAGE_ID: KV存储命名空间ID
```

---

## 六、功能清单

### 6.1 用户功能

```
✓ 用户注册（用户名、邮箱、密码）
✓ 用户登录（JWT Token）
✓ 用户登出
✓ 个人资料编辑
✓ 学术空间展示
```

### 6.2 论文管理

```
✓ 创建论文（标题、摘要、作者、年份、期刊、标签）
✓ 编辑论文
✓ 删除论文
✓ 论文搜索和筛选
✓ 引用计数
```

### 6.3 项目管理

```
✓ 创建项目（名称、描述、状态、进度）
✓ 更新项目进度
✓ 项目状态管理
✓ 项目标签
```

### 6.4 文献库

```
✓ 创建文献库
✓ 添加论文到文献库
✓ 移除论文
✓ 文献库分类
```

### 6.5 系统功能

```
✓ 管理员后台
✓ 数据统计
✓ 备案信息展示
```

---

## 七、部署检查清单

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
□ 验证机甲风格主题正常显示
□ 验证霓虹发光效果
□ 验证金属质感边框
```

---

## 八、测试账号

```
管理员：admin / 123456
演示用户：joan / 11223344
机甲指挥官：COMMANDER_ALPHA / mech2026
```

---

## 九、机甲风格设计指南

### 9.1 视觉元素

```
【发光边框】使用 box-shadow: var(--mecha-glow-cyan) 创建霓虹发光效果
【金属质感】使用渐变和微妙的边框创建金属面板效果
【网格背景】使用 background-image: grid-pattern 创建科技感背景
【扫描线动画】可选的扫描线效果增强科幻感
【角落装饰】使用 ::before 和 ::after 创建角落装饰元素
```

### 9.2 组件样式建议

```
【按钮】深色背景 + 霓虹边框 + 发光悬停效果
【卡片】深空蓝背景 + 细边框 + 内发光
【输入框】深色背景 + 发光边框 + 终端字体
【标签】霓虹色背景 + 深色文字
```

---

## 十、相关文档

- [EdgeOne Pages 文档](https://edgeone.pages.dev/)
- [KV Storage 文档](https://edgeone.pages.dev/features/kv-storage)
- [Edge Functions 文档](https://edgeone.pages.dev/features/edge-functions)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Orbitron 字体](https://fonts.google.com/specimen/Orbitron)
- [Rajdhani 字体](https://fonts.google.com/specimen/Rajdhani)
