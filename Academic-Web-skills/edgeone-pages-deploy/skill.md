# EdgeOne Pages 前端部署技能

## 技能信息

| 属性 | 值 |
|------|-----|
| **名称** | edgeone-pages-deploy |
| **类型** | 部署技能 |
| **适用场景** | 将前端项目部署到腾讯云 EdgeOne Pages |
| **前置要求** | 已安装 edgeone-pages CLI |

## 功能描述

本技能提供将静态网站或单页应用(SPA)快速部署到腾讯云 EdgeOne Pages 的完整解决方案，包括：
- 项目配置文件生成
- 路由规则配置
- Edge Functions 集成
- KV Storage 绑定
- 一键部署脚本

## 使用方法

### 1. 项目准备

确保项目结构符合以下规范：
```
your-project/
├── index.html           # 主入口文件
├── css/                 # 样式文件
├── js/                  # JavaScript 文件
├── assets/              # 静态资源
└── pages.config.json    # EdgeOne 配置文件
```

### 2. 安装 CLI

```bash
npm install -g @cloudflare/edgeone-pages
```

### 3. 部署流程

```bash
# 1. 登录
edgeone-pages login

# 2. 进入项目目录
cd your-project

# 3. 部署
edgeone-pages deploy --directory ./

# 4. 或使用部署脚本
./deploy.sh
```

### 4. 配置文件说明

`pages.config.json` 主要配置项：

| 配置项 | 说明 | 示例 |
|--------|------|------|
| version | 配置文件版本 | 2 |
| routes | 路由规则数组 | 见下方 |
| functions | Edge Functions 配置 | { functionName: config } |
| kvNamespaces | KV Storage 绑定 | [{ id, variables }] |
| envVariables | 环境变量 | [{ variableName, value }] |

### 5. 路由规则配置

```json
{
  "routes": [
    {
      "route": "/api/*",
      "target": "function",
      "function": "api-handler"
    },
    {
      "route": "/*",
      "target": "static"
    }
  ]
}
```

## 配置文件模板

参考 `pages.config.json` 文件，修改以下内容：

```json
{
  "version": 2,
  "routes": [
    {
      "route": "/api/*",
      "target": "function",
      "function": "your-api-function"
    },
    {
      "route": "/*",
      "target": "static"
    }
  ],
  "functions": {
    "your-api-function": {
      "runtime": "nodejs18",
      "entry": "functions/api/index.js"
    }
  },
  "kvNamespaces": [
    {
      "id": "your-kv-namespace",
      "variables": ["YOUR_KV_VAR"]
    }
  ],
  "envVariables": [
    {
      "variableName": "JWT_SECRET",
      "value": "your-secret-key"
    }
  ]
}
```

## 验证部署

运行验证脚本：
```bash
./verify.sh
```

或手动检查：
1. 访问部署的 URL
2. 检查控制台是否有错误
3. 验证 API 接口是否正常

## 常见问题

### Q: 部署失败怎么办？
A: 检查：
- CLI 是否已登录
- 网络连接是否正常
- pages.config.json 格式是否正确

### Q: 如何查看部署日志？
```bash
edgeone-pages logs -f your-project
```

### Q: 如何回滚到旧版本？
```bash
edgeone-pages rollback your-project --version=1
```

## 相关技能

- `kv-storage-config` - KV Storage 配置技能
- `edge-functions-api` - Edge Functions API 开发技能
