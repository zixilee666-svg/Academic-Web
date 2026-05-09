# Academic Web

**基于 EdgeOne Pages 的学术空间管理平台**

一个现代化的学术成果管理网站，支持用户注册登录、论文管理、项目管理、文献库等功能。

## 目录结构

```
Academic-Web/
├── prompt/                      # 部署提示词
│   ├── DEPLOY_PROMPT.md         # 主部署提示词
│   └── SKILLS_GUIDE.md          # Skills 使用指南
│
└── Academic-Web-skills/         # 部署技能包
    ├── edgeone-pages-deploy/     # EdgeOne Pages 部署技能
    ├── kv-storage-config/        # KV Storage 配置技能
    └── edge-functions-api/       # Edge Functions API 技能
```

## 快速开始

### 方法一：使用提示词部署

1. 克隆本仓库
2. 阅读 `prompt/DEPLOY_PROMPT.md`
3. 按照提示词在 EdgeOne 控制台配置

### 方法二：使用 Skills 部署

1. 克隆本仓库
2. 阅读 `Academic-Web-skills/` 下各技能的 README.md
3. 按照步骤部署

## 功能特性

### 用户功能
- ✅ 用户注册登录（JWT 认证）
- ✅ 个人学术空间展示
- ✅ 资料编辑管理

### 学术成果管理
- ✅ 论文管理（创建、编辑、删除、标签）
- ✅ 项目管理（进度跟踪、状态管理）
- ✅ 文献库（论文收藏、分类整理）

### 系统功能
- ✅ 管理员后台
- ✅ 数据统计
- ✅ 备案信息展示

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 构建工具 | Vite |
| 样式 | Tailwind CSS |
| 后端 | EdgeOne Edge Functions |
| 数据存储 | EdgeOne KV Storage |
| 部署 | EdgeOne Pages |

## 部署要求

- Node.js >= 18.0.0
- EdgeOne Pages 账号
- KV Storage 命名空间

## 测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | 123456 | 管理员 |
| joan | 11223344 | 演示用户 |

## 文档

- [部署提示词](./prompt/DEPLOY_PROMPT.md)
- [Skills 使用指南](./prompt/SKILLS_GUIDE.md)
- [EdgeOne Pages 部署](./Academic-Web-skills/edgeone-pages-deploy/)
- [KV Storage 配置](./Academic-Web-skills/kv-storage-config/)
- [Edge Functions API](./Academic-Web-skills/edge-functions-api/)

## License

MIT License
