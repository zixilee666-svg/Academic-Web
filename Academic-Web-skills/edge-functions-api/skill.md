# Edge Functions API 开发技能

## 技能信息

| 属性 | 值 |
|------|-----|
| **名称** | edge-functions-api |
| **类型** | API开发技能 |
| **适用场景** | 使用 Edge Functions 构建 RESTful API |
| **前置要求** | 已创建 EdgeOne 项目 |

## 功能描述

本技能提供使用 Edge Functions 构建后端 API 的完整解决方案，包括：
- 标准 API Handler 结构
- CORS 跨域配置
- JWT 认证实现
- KV Storage 数据操作
- 标准 RESTful 接口模板

## 目录结构

```
functions/
└── api/
    └── index.js       # API 主入口
```

## 基础模板

```javascript
// ============================================================
// 变量声明（必须在顶层）
// ============================================================
let KV_CLIENT = null;
let JWT_SECRET = 'your-secret-key';

// ============================================================
// KV Storage 操作
// ============================================================
async function kvGet(key) {
  try {
    if (!KV_CLIENT) return null;
    const value = await KV_CLIENT.get(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('[KV] Get error:', key, e);
    return null;
  }
}

async function kvSet(key, value, ttl) {
  try {
    if (!KV_CLIENT) return false;
    const data = JSON.stringify(value);
    if (ttl) {
      await KV_CLIENT.put(key, data, { expirationTtl: ttl });
    } else {
      await KV_CLIENT.put(key, data);
    }
    return true;
  } catch (e) {
    console.error('[KV] Set error:', key, e);
    return false;
  }
}

async function kvDel(key) {
  try {
    if (!KV_CLIENT) return false;
    await KV_CLIENT.delete(key);
    return true;
  } catch (e) {
    console.error('[KV] Del error:', key, e);
    return false;
  }
}

// ============================================================
// JWT 认证
// ============================================================
async function signJwt(payload, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const data = encoder.encode(JSON.stringify(payload));
  const signature = await crypto.subtle.sign('HMAC', key, data);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

async function verifyJwt(token, secret) {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const signature = Uint8Array.from(atob(token), c => c.charCodeAt(0));
    const data = encoder.encode(token.split('.')[0]);
    const valid = await crypto.subtle.verify('HMAC', key, signature, data);
    return valid ? JSON.parse(atob(token.split('.')[0])) : null;
  } catch (e) {
    return null;
  }
}

// ============================================================
// 响应工具
// ============================================================
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

function error(message, status = 400) {
  return json({ error: message }, status);
}

// ============================================================
// 主入口（必须导出 onRequest）
// ============================================================
export async function onRequest(context) {
  const { request, env } = context;
  
  // 初始化（重要！）
  KV_CLIENT = env.YOUR_KV_VAR;  // 替换为你的 KV 变量名
  JWT_SECRET = env.JWT_SECRET || JWT_SECRET;

  // 处理 CORS 预检
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }

  // 路由解析
  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '') || '/';
  const method = request.method;

  try {
    // 根据路由和方法分发处理
    const response = await routeHandler(path, method, request);
    return response;
  } catch (e) {
    console.error('[API] Error:', e);
    return error('Internal server error', 500);
  }
}

// ============================================================
// 路由处理（根据实际情况修改）
// ============================================================
async function routeHandler(path, method, request) {
  // GET /items - 获取列表
  if (path === '/items' && method === 'GET') {
    const items = await kvGet('items:list') || [];
    const data = await Promise.all(items.map(id => kvGet(`item:${id}`)));
    return json({ data: data.filter(Boolean) });
  }

  // POST /items - 创建
  if (path === '/items' && method === 'POST') {
    const body = await request.json();
    const id = `item_${Date.now()}`;
    const item = { id, ...body, createdAt: new Date().toISOString() };
    await kvSet(`item:${id}`, item);
    // 添加到列表
    const list = await kvGet('items:list') || [];
    list.push(id);
    await kvSet('items:list', list);
    return json(item, 201);
  }

  // GET /item/:id - 获取单个
  const itemMatch = path.match(/^\/item\/(.+)$/);
  if (itemMatch && method === 'GET') {
    const id = itemMatch[1];
    const item = await kvGet(`item:${id}`);
    if (!item) return error('Not found', 404);
    return json(item);
  }

  // PUT /item/:id - 更新
  if (itemMatch && method === 'PUT') {
    const id = itemMatch[1];
    const body = await request.json();
    const existing = await kvGet(`item:${id}`);
    if (!existing) return error('Not found', 404);
    const updated = { ...existing, ...body, updatedAt: new Date().toISOString() };
    await kvSet(`item:${id}`, updated);
    return json(updated);
  }

  // DELETE /item/:id - 删除
  if (itemMatch && method === 'DELETE') {
    const id = itemMatch[1];
    await kvDel(`item:${id}`);
    // 从列表移除
    const list = await kvGet('items:list') || [];
    const newList = list.filter(i => i !== id);
    await kvSet('items:list', newList);
    return json({ success: true });
  }

  // 未找到路由
  return error('Not found', 404);
}
```

## 认证中间件

```javascript
// 认证装饰器
async function withAuth(request) {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401 };
  }
  
  const token = auth.slice(7);
  const payload = await verifyJwt(token, JWT_SECRET);
  
  if (!payload) {
    return { error: 'Invalid token', status: 401 };
  }
  
  return { userId: payload.userId };
}
```

## API 设计规范

### 命名规范

| 操作 | 方法 | 路径 |
|------|------|------|
| 列表 | GET | `/resources` |
| 详情 | GET | `/resource/:id` |
| 创建 | POST | `/resources` |
| 更新 | PUT | `/resource/:id` |
| 删除 | DELETE | `/resource/:id` |

### 响应格式

```json
// 成功
{ "data": {...} }

// 错误
{ "error": "错误信息" }

// 分页
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100
  }
}
```

### 状态码

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 未找到 |
| 500 | 服务器错误 |

## CORS 配置

```javascript
// 在 json() 函数中配置
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // 或指定域名
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};
```

## 速率限制（可选）

```javascript
const rateLimitMap = new Map();

function rateLimit(ip, limit = 100, windowMs = 60000) {
  const key = `ratelimit:${ip}`;
  const now = Date.now();
  const record = rateLimitMap.get(key) || { count: 0, resetAt: now + windowMs };
  
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + windowMs;
  }
  
  record.count++;
  rateLimitMap.set(key, record);
  
  if (record.count > limit) {
    return false;
  }
  return true;
}
```

## 相关文件

- `index.js` - 完整的 API Handler 示例

## 完整示例

参考 `Academic-Web/Academic-Web-skills/edge-functions-api/index.js` 获取完整的用户管理系统 API 示例。
