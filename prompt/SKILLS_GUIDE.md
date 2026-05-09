# Skills 使用指南

## 概述

本目录包含 Academic Web 项目的技能包，用于在 EdgeOne 中快速部署和配置项目。

## 目录结构

```
Academic-Web-skills/
├── edgeone-pages-deploy/     # EdgeOne Pages 部署技能
├── kv-storage-config/        # KV Storage 配置技能
├── edge-functions-api/      # Edge Functions API 技能
└── README.md                 # 本文件
```

## 使用方法

### 方法一：使用 CodeBuddy 安装技能

```
在 CodeBuddy 中打开项目，输入：
"安装 Academic Web 部署技能"
```

### 方法二：手动复制

将对应的技能文件夹复制到项目的 `.codebuddy/skills/` 目录。

## 技能列表

### 1. edgeone-pages-deploy

**功能**：自动化 EdgeOne Pages 部署

**包含**：
- 部署配置文件
- 构建脚本
- 验证检查

**使用**：
```bash
edgeone pages deploy
```

### 2. kv-storage-config

**功能**：KV Storage 命名空间配置

**包含**：
- 初始化脚本
- 数据结构定义
- 迁移工具

**使用**：
在 EdgeOne 控制台手动配置，或使用 CLI 工具。

### 3. edge-functions-api

**功能**：Edge Functions API 模板

**包含**：
- API Handler 模板
- JWT 认证模块
- CRUD 操作示例

**使用**：
复制到项目的 `edge-functions/` 目录。

## 前提条件

1. EdgeOne Pages 账号
2. Node.js >= 18.0.0
3. Git

## 下一步

1. 查看 `DEPLOY_PROMPT.md` 获取详细部署步骤
2. 阅读各技能目录下的 README.md
3. 按照检查清单完成部署
