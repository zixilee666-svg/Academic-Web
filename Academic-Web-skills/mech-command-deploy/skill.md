# 机甲指挥中心 - EdgeOne 一键部署技能

## 技能信息

| 属性 | 值 |
|------|-----|
| **名称** | mech-command-deploy |
| **类型** | 完整部署技能 |
| **适用场景** | 将机甲战士管理系统一键部署到 EdgeOne Pages |
| **前置要求** | EdgeOne 账号、已安装 node.js |

## 功能描述

本技能提供从零到一的机甲战士管理系统部署方案，整合了：
- 前端静态资源（科幻机甲风格 UI）
- Edge Functions API（用户、机甲、驾驶员、任务管理）
- KV Storage 数据层（完整数据模型）
- JWT 认证系统

## 快速开始

### Step 1: 克隆技能包并创建项目

```bash
git clone https://github.com/zixilee666-svg/Academic-Web.git
cd Academic-Web/Academic-Web-skills/mech-command-deploy

# 创建项目目录
mkdir mech-command-center
cd mech-command-center
mkdir -p css js assets functions/api
```

### Step 2: 部署到 EdgeOne

```bash
# 安装 CLI（如未安装）
npm install -g edgeone@latest

# 登录
edgeone login

# 部署
cd mech-command-center
edgeone pages deploy -n mech-command-center
```

### Step 3: EdgeOne 控制台配置（关键！）

> ⚠️ 部署后必须完成以下配置，否则 API 会返回 401 或无法正常工作

#### 3.1 创建 KV 命名空间

1. 访问 EdgeOne 控制台：https://console.cloud.tencent.com/edgeone/pages
2. 进入 **存储 → KV Storage**
3. 点击「新建命名空间」
4. 名称输入：`mech-command-kv`
5. 复制生成的 **Namespace ID**

#### 3.2 绑定 KV 到 Edge Functions

1. 进入 **Edge Functions** → 选择 `mech-command-api` 函数
2. 点击「绑定资源」→ 「添加绑定」
3. 选择 KV 命名空间：`mech-command-kv`
4. **变量名**设置为：`MECH_COMMAND_KV`（必须与代码中一致）
5. 保存

#### 3.3 设置环境变量

1. 在 Edge Functions 函数设置中
2. 找到「环境变量」→ 「新增变量」
3. 添加：
   - **变量名**：`JWT_SECRET`
   - **值**：`mech-command-jwt-secret-alpha-2026`

#### 3.4 重新部署

配置完成后，需要**重新部署**使配置生效：

```bash
edgeone pages deploy
```

### Step 4: 验证部署

部署并配置完成后，访问您的网站：

```
https://mech-command-center-xxxxx.edgeone.cool
```

**测试账号**：
| 账号 | 密码 |
|------|------|
| COMMANDER_ALPHA | mech2026 |

## 项目文件结构

```
mech-command-center/
├── index.html              # 主页面（机甲风格 UI）
├── css/
│   └── main.css            # 科幻机甲风格样式
├── js/
│   ├── api.js              # API 通信模块
│   ├── auth.js             # 认证模块
│   └── app.js              # 主应用逻辑
├── functions/
│   └── api/
│       └── index.js        # Edge Functions API Handler
└── pages.config.json       # 部署配置文件
```

## 数据结构

```javascript
// 机甲数据
{ id, serialNumber, codename, model, class, status, health, energy, pilot, location }

// 驾驶员数据
{ id, code, callsign, rank, syncRate, mechId, status, specializations }

// 任务数据
{ id, code, name, type, priority, status, zone, objectives, assignedMechs }

// 指挥官数据
{ id, code, callsign, clearance }
```

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/auth/login` | POST | 登录 |
| `/api/mechs` | GET | 获取机甲列表 |
| `/api/pilots` | GET | 获取驾驶员列表 |
| `/api/missions` | GET | 获取任务列表 |
| `/api/dashboard` | GET | 仪表盘数据 |
| `/api/alerts` | GET | 获取警报 |

## KV Storage 变量配置

| 变量名 | 说明 | 值示例 |
|--------|------|--------|
| `MECH_COMMAND_KV` | KV 命名空间绑定 | 自动从控制台获取 |
| `JWT_SECRET` | JWT 加密密钥 | `mech-command-jwt-secret-alpha-2026` |

## 常见问题

### Q: 部署后页面空白？
A: 检查浏览器控制台是否有错误，确保 `js/` 目录下的文件存在。

### Q: API 返回 401？
A: 这是因为 KV Storage 未绑定或变量名不一致。请检查 EdgeOne 控制台的 KV 绑定配置。

### Q: 数据未初始化？
A: 首次请求 API 时会自动初始化示例数据（机甲、驾驶员、任务）。

### Q: 预览链接过期？
A: 每次在 EdgeOne 控制台点击「预览」会生成新的访问链接。

## 部署记录

| 版本 | 日期 | 地址 |
|------|------|------|
| v1.0 | 2026-05-10 | https://mech-command-center-mo75qfaf.edgeone.cool |

## 相关技能

- 单个技能包含前端+后端+数据库完整部署方案
- 整合了 edgeone-pages-deploy、kv-storage-config、edge-functions-api
