# Edge Functions API Skill

## 功能

Academic Web 的 Edge Functions API Handler，包含完整的用户认证、数据存储和 CRUD 操作。

## 包含文件

```
edge-functions-api/
├── index.js           # API Handler 主文件
├── schema.js          # 数据结构定义
├── auth.js            # 认证模块
├── storage.js         # 存储模块
└── README.md         # 本文件
```

## 文件结构

### index.js

主 API Handler，包含：
- 请求路由分发
- CORS 配置
- JWT 认证
- 所有 CRUD 操作

### auth.js

认证模块，包含：
- JWT Token 生成和验证
- 密码哈希
- 用户认证

### storage.js

存储模块，包含：
- KV Storage 操作封装
- JSON 便捷方法
- 列表操作

### schema.js

数据结构定义，包含：
- 用户数据结构
- 论文数据结构
- 项目数据结构
- 文献库数据结构

## API 端点

### 认证

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/auth/login | 用户登录 | 否 |
| POST | /api/auth/register | 用户注册 | 否 |
| GET | /api/auth/me | 获取当前用户 | 是 |
| POST | /api/auth/logout | 用户登出 | 是 |

### 空间

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/spaces | 获取所有空间 | 否 |
| GET | /api/spaces/:username | 获取特定空间 | 否 |
| PUT | /api/spaces/:username | 更新空间 | 是 |

### 论文

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/users/:username/papers | 获取用户论文 | 否 |
| GET | /api/papers/:id | 获取论文详情 | 否 |
| POST | /api/papers | 创建论文 | 是 |
| PUT | /api/papers/:id | 更新论文 | 是 |
| DELETE | /api/papers/:id | 删除论文 | 是 |

### 项目

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/users/:username/projects | 获取用户项目 | 否 |
| GET | /api/projects/:id | 获取项目详情 | 否 |
| POST | /api/projects | 创建项目 | 是 |
| PUT | /api/projects/:id | 更新项目 | 是 |
| DELETE | /api/projects/:id | 删除项目 | 是 |

### 文献库

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/users/:username/libraries | 获取用户文献库 | 否 |
| GET | /api/libraries/:id | 获取文献库详情 | 否 |
| POST | /api/libraries | 创建文献库 | 是 |
| PUT | /api/libraries/:id | 更新文献库 | 是 |
| DELETE | /api/libraries/:id | 删除文献库 | 是 |

### 管理

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | /api/users | 获取所有用户 | 管理员 |
| GET | /api/stats | 获取统计数据 | 管理员 |

## 使用方法

### 1. 复制文件

将 `index.js` 复制到项目的 `edge-functions/` 目录。

### 2. 配置 Edge Functions

在 EdgeOne 控制台：
1. 创建 Edge Functions 函数
2. 路由配置：`/api/*`
3. 绑定 KV Storage
4. 设置环境变量

### 3. 验证

```bash
# 测试健康检查
curl https://your-site.edgeone.page/api/hello

# 测试登录
curl -X POST https://your-site.edgeone.page/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"joan","password":"11223344"}'
```

## 响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "Success"
}
```

### 错误响应

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 错误代码

| 代码 | 说明 |
|------|------|
| VALIDATION_ERROR | 参数验证失败 |
| UNAUTHORIZED | 未认证 |
| FORBIDDEN | 无权限 |
| NOT_FOUND | 资源不存在 |
| CONFLICT | 资源冲突 |
| BAD_REQUEST | 请求格式错误 |
