# KV Storage 数据管理技能

## 技能信息

| 属性 | 值 |
|------|-----|
| **名称** | kv-storage-config |
| **类型** | 数据管理技能 |
| **适用场景** | EdgeOne KV Storage 数据结构设计与管理 |
| **前置要求** | 已创建 EdgeOne 项目并绑定 KV 命名空间 |

## 功能描述

本技能提供 EdgeOne KV Storage 的完整数据管理方案，包括：
- 数据结构设计规范
- 命名规则定义
- CRUD 操作封装
- 数据迁移脚本
- 示例数据导入

## 数据结构设计

### 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 单条数据 | `entity:id` | `user:u123456` |
| 列表数据 | `entity:list` | `user:list` |
| 索引数据 | `entity:index:field` | `user:index:email` |
| 会话数据 | `session:token` | `session:abc123xyz` |

### 数据模型模板

#### 用户数据
```json
{
  "id": "string - UUID",
  "field1": "value1",
  "field2": "value2",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

#### 列表数据
```json
[
  "id1",
  "id2",
  "id3"
]
```

## Edge Functions 中的 KV 操作

### 初始化 KV 客户端

```javascript
// 在 onRequest 函数顶部声明
let KV_CLIENT = null;

export async function onRequest(context) {
  const { env } = context;
  // 初始化 KV（重要！必须从 env 获取）
  KV_CLIENT = env.YOUR_KV_VAR;
}
```

### CRUD 操作封装

```javascript
// 通用操作函数
async function kvGet(key) {
  try {
    const value = await KV_CLIENT.get(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error('[KV] Get error:', key, e);
    return null;
  }
}

async function kvSet(key, value, ttl) {
  try {
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
    await KV_CLIENT.delete(key);
    return true;
  } catch (e) {
    console.error('[KV] Del error:', key, e);
    return false;
  }
}

async function kvList(prefix, limit = 100) {
  try {
    const list = await KV_CLIENT.list({ prefix, limit });
    return list.keys.map(k => k.name);
  } catch (e) {
    console.error('[KV] List error:', e);
    return [];
  }
}
```

## 数据迁移

### 迁移脚本结构

```javascript
// migrate.js
const KV_CLIENT = null; // 需在运行时注入

async function migrate() {
  // 1. 读取源数据
  const users = await readUsersFromSource();
  
  // 2. 转换格式
  const transformed = users.map(u => transformUser(u));
  
  // 3. 批量写入
  for (const user of transformed) {
    await kvSet(`user:${user.id}`, user);
    console.log(`Migrated user: ${user.id}`);
  }
  
  console.log('Migration completed!');
}

migrate();
```

### 运行迁移
```bash
# 方式1: 直接运行
node migrate.js

# 方式2: 通过 Edge Functions 触发
curl -X POST https://your-domain.com/api/migrate
```

## 数据导入

### JSON 格式导入

```bash
# 使用 import script
node scripts/import-json.js --file data.json
```

### SQL 格式导入

参考 `init-schema.sql` 文件，使用以下结构：

```sql
-- 创建用户
SET user:new-user-id = '{"id":"new-user-id","name":"Test","email":"test@example.com"}';

-- 添加到列表
SET user:list = '["existing-id","new-user-id"]';
```

## EdgeOne 控制台配置

1. **创建命名空间**
   - 控制台 → 存储 → KV Storage
   - 点击「新建命名空间」
   - 输入名称（如 `my-app-kv`）

2. **绑定到 Edge Functions**
   - 控制台 → Edge Functions → 选择函数
   - 「绑定资源」→ 选择 KV 命名空间
   - 变量名设置为 `MY_APP_KV`

3. **设置环境变量**（可选）
   - 在 KV 绑定时设置变量名
   - 代码中通过 `env.MY_APP_KV` 访问

## 性能优化

| 优化项 | 方法 |
|--------|------|
| 减少读取 | 使用本地缓存 |
| 批量操作 | 合并多次操作为一次 |
| 合理TTL | 设置数据过期时间 |
| 索引设计 | 使用列表+索引结构 |

## 常见问题

### Q: KV 数据有大小限制吗？
A: 单条数据建议不超过 25MB，整体存储无明确限制。

### Q: 如何保证数据一致性？
A:
- 写入后验证
- 使用事务（如果支持）
- 操作日志记录

### Q: 数据会自动过期吗？
A: 需要手动设置 TTL，或使用 `kv set` 的过期参数。

## 相关文件

- `init-schema.sql` - 数据结构定义
- `sample-data.json` - 示例数据
- `migrate.js` - 迁移脚本
