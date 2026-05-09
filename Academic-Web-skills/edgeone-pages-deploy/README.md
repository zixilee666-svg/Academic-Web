# EdgeOne Pages Deploy Skill

## 功能

自动化 Academic Web 项目的 EdgeOne Pages 部署流程。

## 包含文件

```
edgeone-pages-deploy/
├── pages.config.json      # EdgeOne 配置文件
├── deploy.sh              # 部署脚本
├── verify.sh              # 验证脚本
└── README.md              # 本文件
```

## 使用方法

### 1. 配置文件准备

确保 `pages.config.json` 已正确配置：

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
    "JWT_SECRET": "your-jwt-secret-key-min-32-chars"
  },
  "site": {
    "icp": {
      "number": "粤ICP备XXXXXXXX号-X",
      "link": "https://beian.miit.gov.cn/"
    }
  }
}
```

### 2. 执行部署

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 部署到 EdgeOne
./deploy.sh
```

### 3. 验证部署

```bash
./verify.sh
```

## 环境变量

| 变量名 | 描述 | 必填 |
|--------|------|------|
| JWT_SECRET | JWT 加密密钥（至少32字符） | 是 |
| KV_STORAGE_ID | KV 存储命名空间 ID | 是 |

## 部署检查

- [ ] 构建成功
- [ ] 路由配置正确
- [ ] 环境变量已设置
- [ ] KV Storage 已绑定
- [ ] 备案信息已配置
- [ ] 部署成功
