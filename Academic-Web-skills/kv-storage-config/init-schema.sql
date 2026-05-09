-- Academic Web KV Storage 数据结构定义
-- 此文件用于参考，实际数据结构由 Edge Functions 动态管理

-- ===========================================
-- 用户相关数据
-- ===========================================

-- 用户主数据
-- Key Pattern: users:{userId}
-- 示例: users:admin, users:user-123
CREATE_KV users:{userId} = {
  "id": "string",
  "username": "string",
  "displayName": "string",
  "email": "string",
  "passwordHash": "string (SHA-256)",
  "role": "user | admin",
  "institution": "string",
  "bio": "string",
  "avatar": "string",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}

-- 用户名到ID映射
-- Key Pattern: users:by-username:{username}
-- 示例: users:by-username:joan
CREATE_KV users:by-username:{username} = "userId"

-- 用户索引列表
-- Key: users:index
CREATE_KV users:index = ["userId1", "userId2", ...]

-- ===========================================
-- 学术空间相关数据
-- ===========================================

-- 学术空间配置
-- Key Pattern: spaces:{username}
-- 示例: spaces:joan
CREATE_KV spaces:{username} = {
  "username": "string",
  "displayName": "string",
  "bio": "string",
  "institution": "string",
  "theme": "light | dark",
  "modules": ["papers", "projects", "library", "chat"],
  "social": {
    "twitter": "string",
    "github": "string",
    "linkedin": "string"
  },
  "stats": {
    "papers": "number",
    "projects": "number",
    "libraries": "number"
  },
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}

-- 空间索引列表
-- Key: spaces:index
CREATE_KV spaces:index = ["username1", "username2", ...]

-- ===========================================
-- 论文相关数据
-- ===========================================

-- 论文主数据
-- Key Pattern: papers:{paperId}
-- 示例: papers:paper-123
CREATE_KV papers:{paperId} = {
  "id": "string",
  "userId": "string",
  "username": "string",
  "title": "string",
  "abstract": "string",
  "authors": ["string"],
  "year": "number",
  "venue": "string",
  "tags": ["string"],
  "citations": "number",
  "pdfUrl": "string",
  "doi": "string",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}

-- 用户论文列表
-- Key Pattern: users:{userId}:papers
CREATE_KV users:{userId}:papers = ["paperId1", "paperId2", ...]

-- ===========================================
-- 项目相关数据
-- ===========================================

-- 项目主数据
-- Key Pattern: projects:{projectId}
CREATE_KV projects:{projectId} = {
  "id": "string",
  "userId": "string",
  "username": "string",
  "name": "string",
  "description": "string",
  "status": "active | completed | paused",
  "progress": "number (0-100)",
  "tags": ["string"],
  "objectives": ["string"],
  "startDate": "ISO8601",
  "endDate": "ISO8601",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}

-- 用户项目列表
-- Key Pattern: users:{userId}:projects
CREATE_KV users:{userId}:projects = ["projectId1", "projectId2", ...]

-- ===========================================
-- 文献库相关数据
-- ===========================================

-- 文献库主数据
-- Key Pattern: libraries:{libId}
CREATE_KV libraries:{libId} = {
  "id": "string",
  "userId": "string",
  "username": "string",
  "name": "string",
  "description": "string",
  "papers": ["paperId"],
  "paperCount": "number",
  "tags": ["string"],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}

-- 用户文献库列表
-- Key Pattern: users:{userId}:libraries
CREATE_KV users:{userId}:libraries = ["libId1", "libId2", ...]
