# Academic Web Skills 技能包目录

本目录包含 Academic Web 项目的部署技能包，可直接用于 EdgeOne Pages 部署。

## 目录结构

```
Academic-Web-skills/
├── mech-command-deploy/      # 机甲指挥中心 - 整合技能（推荐）
│   └── skill.md              # 完整部署指南
│
├── edgeone-pages-deploy/     # EdgeOne Pages 部署配置
│   ├── skill.md             # 技能说明
│   ├── pages.config.json     # 配置文件
│   ├── deploy.sh            # 部署脚本
│   └── verify.sh            # 验证脚本
│
├── kv-storage-config/        # KV Storage 配置
│   ├── skill.md             # 技能说明
│   ├── init-schema.sql       # 数据结构定义
│   ├── sample-data.json      # 示例数据
│   └── migrate.js            # 迁移脚本
│
└── edge-functions-api/        # Edge Functions API
    ├── skill.md              # 技能说明
    └── index.js              # API Handler
```

## 快速使用

### 推荐：使用整合技能

```bash
# 阅读机甲指挥中心部署技能
cat mech-command-deploy/skill.md
```

### 或使用独立技能

```bash
# 1. 复制配置文件到项目
cp edgeone-pages-deploy/pages.config.json your-project/

# 2. 复制 API Handler
cp edge-functions-api/index.js your-project/edge-functions/

# 3. 在 EdgeOne 控制台创建 KV 命名空间并绑定
```

## 推荐部署流程

### Step 1: 部署项目

```bash
edgeone pages deploy -n mech-command-center
```

### Step 2: EdgeOne 控制台配置

1. **创建 KV 命名空间**：`mech-command-kv`
2. **绑定到函数**：变量名 `MECH_COMMAND_KV`
3. **设置环境变量**：`JWT_SECRET=mech-command-jwt-secret-alpha-2026`
4. **重新部署**

### Step 3: 访问测试

```
https://mech-command-center-xxxx.edgeone.cool
```

**测试账号**: `COMMANDER_ALPHA` / `mech2026`

## 环境变量

| 变量名 | 描述 | 必填 |
|--------|------|------|
| JWT_SECRET | JWT 加密密钥（至少32字符） | 是 |
| MECH_COMMAND_KV | KV 命名空间绑定 | 是 |

## 验证部署

预期结果：
- ✅ 主页访问成功
- ✅ 用户登录成功
- ✅ 机甲列表加载
- ✅ 驾驶员列表加载
- ✅ 任务列表加载
- ✅ 仪表盘数据展示

## 默认测试账号

| 账号 | 密码 | 说明 |
|------|------|------|
| COMMANDER_ALPHA | mech2026 | 机甲指挥中心管理员 |

## 相关文档

- [EdgeOne Pages 文档](https://edgeone.pages.dev/)
- [KV Storage 文档](https://edgeone.pages.dev/features/kv-storage)
- [Edge Functions 文档](https://edgeone.pages.dev/features/edge-functions)
