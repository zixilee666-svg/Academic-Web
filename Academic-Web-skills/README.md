# Academic Web Skills 技能包目录

本目录包含 Academic Web 项目的部署技能包，可直接用于 EdgeOne Pages 部署。

## 目录结构

```
Academic-Web-skills/
├── edgeone-pages-deploy/     # EdgeOne Pages 部署配置
│   ├── README.md             # 使用说明
│   ├── pages.config.json     # 配置文件
│   ├── deploy.sh             # 部署脚本
│   └── verify.sh             # 验证脚本
│
├── kv-storage-config/        # KV Storage 配置
│   ├── README.md             # 使用说明
│   ├── init-schema.sql       # 数据结构定义
│   ├── sample-data.json      # 示例数据
│   └── migrate.js            # 迁移脚本
│
└── edge-functions-api/        # Edge Functions API
    ├── README.md             # 使用说明
    └── index.js              # API Handler
```

## 快速使用

### 1. 部署前端和配置

```bash
# 复制配置文件到项目
cp edgeone-pages-deploy/pages.config.json your-project/

# 使用部署脚本
chmod +x edgeone-pages-deploy/deploy.sh
./edgeone-pages-deploy/deploy.sh
```

### 2. 配置 KV Storage

```bash
# 查看数据结构
cat kv-storage-config/init-schema.sql

# 初始化数据
node kv-storage-config/migrate.js
```

### 3. 部署 Edge Functions API

```bash
# 复制 API Handler
cp edge-functions-api/index.js your-project/edge-functions/
```

## 技能详解

### edgeone-pages-deploy

**功能：** 自动化 EdgeOne Pages 部署

**包含：**
- `pages.config.json` - EdgeOne 配置文件
- `deploy.sh` - 一键部署脚本
- `verify.sh` - 部署验证脚本

**前提条件：**
- EdgeOne Pages 项目已创建
- EdgeOne CLI 已安装

### kv-storage-config

**功能：** KV Storage 数据配置

**包含：**
- `init-schema.sql` - 数据结构定义
- `sample-data.json` - 示例数据
- `migrate.js` - 数据迁移脚本

**前提条件：**
- KV 命名空间已创建
- 已绑定到 Edge Functions

### edge-functions-api

**功能：** 完整的后端 API

**包含：**
- `index.js` - API Handler（JWT 认证、CRUD 操作）

**前提条件：**
- Edge Functions 已创建
- KV Storage 已绑定

## 环境变量

| 变量名 | 描述 | 必填 |
|--------|------|------|
| JWT_SECRET | JWT 加密密钥（至少32字符） | 是 |
| KV_STORAGE_ID | KV 存储命名空间 ID | 是 |

## 验证部署

```bash
# 运行验证脚本
./edgeone-pages-deploy/verify.sh https://your-project.edgeone.page
```

预期结果：
- ✅ 主页访问成功
- ✅ API 健康检查通过
- ✅ 用户注册成功
- ✅ 用户登录成功
- ✅ 获取空间列表成功

## 默认测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | 123456 | 管理员 |
| joan | 11223344 | 演示用户 |

## 下一步

1. 完成部署后，在 EdgeOne 控制台配置域名
2. 配置备案信息
3. 测试所有功能
4. 上线运营

## 相关文档

- [EdgeOne Pages 文档](https://edgeone.pages.dev/)
- [KV Storage 文档](https://edgeone.pages.dev/features/kv-storage)
- [Edge Functions 文档](https://edgeone.pages.dev/features/edge-functions)
