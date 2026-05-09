# KV Storage Config Skill

## 功能

配置 Academic Web 项目的 KV Storage 命名空间和数据结构。

## 包含文件

```
kv-storage-config/
├── init-schema.sql     # 数据结构定义
├── sample-data.json    # 示例数据
├── migrate.js          # 迁移脚本
└── README.md          # 本文件
```

## EdgeOne 控制台配置

### 1. 创建 KV 命名空间

1. 登录 [EdgeOne 控制台](https://edgeone.pages.dev/)
2. 进入「存储」→「KV Storage」
3. 点击「创建命名空间」
4. 输入名称：`academic_hub_kv`
5. 选择区域（根据需求）
6. 点击「确认」

### 2. 绑定到 Edge Functions

1. 进入「Edge Functions」
2. 选择 `api` 函数
3. 点击「绑定资源」
4. 选择 KV 命名空间 `academic_hub_kv`
5. 设置变量名：`ACADEMIC_HUB_KV`
6. 点击「确认」

### 3. 设置环境变量

在 Edge Functions 配置页面设置：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| JWT_SECRET | your-jwt-secret-key-min-32-chars | JWT 加密密钥 |

## 数据结构

### 用户数据

```
Key: users:{userId}
Value: {
  id: string,
  username: string,
  displayName: string,
  email: string,
  passwordHash: string,
  role: "user" | "admin",
  institution: string,
  bio: string,
  createdAt: string
}
```

### 用户名索引

```
Key: users:by-username:{username}
Value: userId
```

### 用户列表

```
Key: users:index
Value: [userId1, userId2, ...]
```

### 学术空间

```
Key: spaces:{username}
Value: {
  username: string,
  displayName: string,
  bio: string,
  institution: string,
  theme: "light" | "dark",
  modules: string[],
  stats: { papers: number, projects: number, libraries: number }
}
```

### 空间索引

```
Key: spaces:index
Value: [username1, username2, ...]
```

### 论文数据

```
Key: papers:{paperId}
Value: {
  id: string,
  userId: string,
  username: string,
  title: string,
  abstract: string,
  authors: string[],
  year: number,
  venue: string,
  tags: string[],
  citations: number,
  createdAt: string
}
```

### 用户论文列表

```
Key: users:{userId}:papers
Value: [paperId1, paperId2, ...]
```

### 项目数据

```
Key: projects:{projectId}
Value: {
  id: string,
  userId: string,
  username: string,
  name: string,
  description: string,
  status: "active" | "completed" | "paused",
  progress: number,
  tags: string[],
  createdAt: string
}
```

### 用户项目列表

```
Key: users:{userId}:projects
Value: [projectId1, projectId2, ...]
```

### 文献库数据

```
Key: libraries:{libId}
Value: {
  id: string,
  userId: string,
  username: string,
  name: string,
  description: string,
  papers: string[],
  paperCount: number,
  tags: string[],
  createdAt: string
}
```

### 用户文献库列表

```
Key: users:{userId}:libraries
Value: [libId1, libId2, ...]
```

## 迁移脚本使用

```bash
# 安装依赖
npm install

# 运行迁移
node migrate.js
```

## 默认账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | 123456 | 管理员 |
| joan | 11223344 | 演示用户 |
