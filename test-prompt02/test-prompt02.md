# Academic Web 部署提示词 - 多巴胺风格

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

### 2.4 样式配置 - 多巴胺风格

```javascript
// tailwind.config.js - 多巴胺风格配色方案
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 多巴胺主色调 - 活力粉橙
        primary: '#FF6B9D',      // 活力粉
        'primary-light': '#FF8FB3',
        secondary: '#FFD93D',   // 阳光黄
        'secondary-light': '#FFE566',
        accent: '#6BCB77',       // 清新绿
        
        // 多巴胺彩虹色板
        dopamine: {
          pink: '#FF6B9D',
          orange: '#FFA94D',
          yellow: '#FFD93D',
          green: '#6BCB77',
          cyan: '#4ECDC4',
          blue: '#74C0FC',
          purple: '#B197FC',
          rose: '#F783AC',
        },
        
        // 柔和背景色
        soft: {
          pink: '#FFF5F7',
          yellow: '#FFF9DB',
          green: '#F3FBF4',
          blue: '#F0F7FF',
          purple: '#F5F3FF',
        },
        
        // 表面颜色
        surface: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
        },
        
        // 文字颜色
        text: {
          primary: '#1E293B',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        display: ['Quicksand', 'Poppins', 'sans-serif'],
        sans: ['Nunito', 'Quicksand', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'lift': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
        'colored': '0 4px 14px 0 rgba(255, 107, 157, 0.39)',
        'colored-green': '0 4px 14px 0 rgba(107, 203, 119, 0.39)',
        'colored-blue': '0 4px 14px 0 rgba(116, 192, 252, 0.39)',
        'colored-yellow': '0 4px 14px 0 rgba(255, 217, 61, 0.39)',
        'colored-purple': '0 4px 14px 0 rgba(177, 151, 252, 0.39)',
      },
      animation: {
        'bounce-soft': 'bounce-soft 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-5px) rotate(1deg)' },
          '66%': { transform: 'translateY(-2px) rotate(-1deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dot-pattern': 'radial-gradient(circle, #E2E8F0 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
```

---

## 三、多巴胺风格 CSS 变量

```css
/* 多巴胺风格全局 CSS 变量 */
:root {
  /* 主色调 - 活力粉橙 */
  --dopamine-primary: #FF6B9D;
  --dopamine-primary-light: #FF8FB3;
  --dopamine-secondary: #FFD93D;
  --dopamine-accent: #6BCB77;
  
  /* 彩虹辅助色 */
  --dopamine-orange: #FFA94D;
  --dopamine-cyan: #4ECDC4;
  --dopamine-blue: #74C0FC;
  --dopamine-purple: #B197FC;
  --dopamine-rose: #F783AC;
  
  /* 柔和背景 */
  --dopamine-bg-pink: #FFF5F7;
  --dopamine-bg-yellow: #FFF9DB;
  --dopamine-bg-green: #F3FBF4;
  --dopamine-bg-blue: #F0F7FF;
  --dopamine-bg-purple: #F5F3FF;
  
  /* 表面颜色 */
  --dopamine-surface: #FFFFFF;
  --dopamine-surface-alt: #F8FAFC;
  
  /* 文字颜色 */
  --dopamine-text: #1E293B;
  --dopamine-text-secondary: #64748B;
  
  /* 柔和阴影 */
  --dopamine-shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04);
  --dopamine-shadow-lift: 0 10px 40px -10px rgba(0, 0, 0, 0.15);
  
  /* 圆角 */
  --dopamine-radius-sm: 0.5rem;
  --dopamine-radius: 1rem;
  --dopamine-radius-lg: 1.5rem;
  --dopamine-radius-xl: 2rem;
}

/* 浅色主题（默认）*/
.light {
  --dopamine-bg: #FFFFFF;
  --dopamine-surface: #F8FAFC;
}

/* 深色多巴胺风格 */
.dopamine-dark {
  --dopamine-bg: #1E1E2E;
  --dopamine-surface: #2D2D3F;
  --dopamine-primary: #FF6B9D;
  --dopamine-secondary: #FFD93D;
  --dopamine-accent: #6BCB77;
  --dopamine-text: #F8F9FA;
  --dopamine-text-secondary: #ADB5BD;
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
    "JWT_SECRET": "dopamine-jwt-secret-happy-2026-colorful",
    "KV_STORAGE_ID": "dopamine-kv-storage-id"
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
- JWT_SECRET: 多巴胺风格JWT加密密钥（至少32字符）
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
□ 验证多巴胺风格主题正常显示
□ 验证彩虹配色渐变效果
□ 验证柔和圆角和阴影
□ 验证浮动动画效果
```

---

## 八、测试账号

```
管理员：admin / 123456
演示用户：joan / 11223344
彩虹用户：RAINBOW_USER / colorful2026
```

---

## 九、多巴胺风格设计指南

### 9.1 视觉元素

```
【彩虹渐变】使用多巴胺彩虹色创建渐变背景和按钮
【柔和圆角】使用 border-radius 创建设计感
【柔和阴影】使用 box-shadow 创建柔和的提升效果
【彩色边框】使用彩虹色作为边框和装饰
【浮动动画】使用 translateY 和 rotate 创建有趣动画
【emoji 装饰】适当添加 emoji 增加趣味性
```

### 9.2 组件样式建议

```
【按钮】彩虹渐变背景 + 白色文字 + 柔和阴影 + 悬停放大
【卡片】白色/浅色背景 + 彩虹边框 + 柔和圆角 + 悬停阴影
【标签/徽章】彩色背景 + 深色文字 + 小圆角
【输入框】浅色背景 + 柔和边框 + 焦点彩虹边框
【导航栏】玻璃态效果 + 柔和背景 + 彩虹高亮
```

### 9.3 配色组合建议

```
【活力组合】粉色 + 橙色 + 黄色 - 用于主要 CTA
【清新组合】绿色 + 蓝色 + 青色 - 用于成功状态
【梦幻组合】紫色 + 蓝色 + 粉色 - 用于特殊功能
【阳光组合】黄色 + 橙色 + 粉色 - 用于警告和提示
```

---

## 十、相关文档

- [EdgeOne Pages 文档](https://edgeone.pages.dev/)
- [KV Storage 文档](https://edgeone.pages.dev/features/kv-storage)
- [Edge Functions 文档](https://edgeone.pages.dev/features/edge-functions)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Quicksand 字体](https://fonts.google.com/specimen/Quicksand)
- [Nunito 字体](https://fonts.google.com/specimen/Nunito)
