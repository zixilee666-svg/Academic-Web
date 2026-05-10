# 机甲战士管理系统 (Mech Warrior Management System)

## 一、项目概述

构建一个未来科幻风格的机甲战士管理和作战指挥平台，支持机甲档案管理、驾驶员调度、任务分配、实时监控等功能。

## 二、技术架构

### 前端
- **框架**: 纯 HTML + CSS + JavaScript（单页应用）
- **UI 风格**: 科幻机甲风（深色金属质感、霓虹光效、扫描线动画）
- **特效**: 粒子效果、全息投影、数据流动画
- **字体**: Orbitron（标题）、Rajdhani（正文）

### 后端
- **平台**: 腾讯云 EdgeOne Pages
- **API**: Edge Functions（支持 CORS）
- **存储**: KV Storage（机甲数据、驾驶员档案、任务记录）
- **认证**: JWT Token + 驾驶员生物识别模拟

### 实时系统
- **WebSocket**: 实时战术地图
- **状态同步**: 机甲健康度、能量值实时更新

## 三、功能模块

### 核心功能
1. **机甲档案管理**
   - 机甲型号、编号、状态
   - 武器系统配置
   - 维修记录追踪
   - 能耗分析

2. **驾驶员调度**
   - 驾驶员档案（编号、代号、熟练度）
   - 神经同步率
   - 轮班调度
   - 训练记录

3. **任务指挥中心**
   - 任务创建与分配
   - 战术地图（网格化战场）
   - 实时战力分析
   - 任务进度追踪

4. **实时监控台**
   - 机甲状态面板
   - 能量核心监控
   - 战场态势感知
   - 警报系统

### 用户系统
- 指挥官账号体系
- 驾驶员档案
- 操作日志记录

## 四、数据结构 (KV Storage)

```json
{
  "mech:{mechId}": {
    "id": "string",
    "serialNumber": "string",
    "codename": "string",
    "model": "string",
    "class": "light|medium|heavy|titan",
    "status": "standby|active|deployed|maintenance|destroyed",
    "health": 100,
    "energy": 100,
    "weapons": [
      { "slot": 1, "name": "string", "ammo": 100, "damage": 85 }
    ],
    "pilot": "pilotId|null",
    "location": { "x": 0, "y": 0, "zone": "string" },
    "stats": {
      "totalMissions": 0,
      "victories": 0,
      "repairs": 0
    },
    "lastMaintenance": "ISO8601",
    "createdAt": "ISO8601"
  },
  "pilot:{pilotId}": {
    "id": "string",
    "code": "string",
    "callsign": "string",
    "rank": "cadet|ensign|lieutenant|captain|commander",
    "syncRate": 0-100,
    "mechId": "mechId|null",
    "status": "available|assigned|onLeave|ko",
    "specializations": ["string"],
    "stats": {
      "missionsCompleted": 0,
      "killCount": 0,
      "survivalRate": 0
    },
    "assignedSince": "ISO8601",
    "createdAt": "ISO8601"
  },
  "mission:{missionId}": {
    "id": "string",
    "code": "string",
    "name": "string",
    "type": "recon|assault|defense|extraction|patrol",
    "priority": "low|medium|high|critical",
    "status": "planning|ready|deployed|completed|failed",
    "zone": "string",
    "objectives": [
      { "id": 1, "description": "string", "completed": false }
    ],
    "assignedMechs": ["mechId"],
    "startTime": "ISO8601",
    "endTime": "ISO8601|null",
    "result": "victory|defeat|null",
    "createdAt": "ISO8601"
  },
  "commander:{commanderId}": {
    "id": "string",
    "username": "string",
    "password": "string",
    "callsign": "string",
    "clearance": "alpha|beta|gamma|omega",
    "createdAt": "ISO8601"
  },
  "session:{token}": {
    "userId": "string",
    "userType": "commander|pilot",
    "expiresAt": "ISO8601"
  },
  "alert:{alertId}": {
    "id": "string",
    "type": "warning|critical|emergency",
    "source": "string",
    "message": "string",
    "acknowledged": false,
    "createdAt": "ISO8601"
  }
}
```

## 五、API 接口设计

### 机甲管理
- `GET /api/mechs` - 获取机甲列表
- `GET /api/mech/:id` - 获取机甲详情
- `POST /api/mech` - 注册新机甲
- `PUT /api/mech/:id` - 更新机甲信息
- `POST /api/mech/:id/assign` - 分配驾驶员
- `POST /api/mech/:id/repair` - 维修机甲

### 驾驶员管理
- `GET /api/pilots` - 获取驾驶员列表
- `GET /api/pilot/:id` - 获取驾驶员详情
- `POST /api/pilot` - 注册新驾驶员
- `PUT /api/pilot/:id` - 更新驾驶员信息
- `POST /api/pilot/:id/train` - 训练驾驶员

### 任务指挥
- `GET /api/missions` - 获取任务列表
- `GET /api/mission/:id` - 获取任务详情
- `POST /api/mission` - 创建任务
- `PUT /api/mission/:id` - 更新任务
- `POST /api/mission/:id/deploy` - 部署机甲
- `POST /api/mission/:id/complete` - 完成任务

### 监控与警报
- `GET /api/dashboard` - 指挥台数据
- `GET /api/alerts` - 获取警报列表
- `POST /api/alert/:id/ack` - 确认警报

### 认证
- `POST /api/auth/login` - 指挥官登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/verify` - 验证Token

## 六、部署步骤

### 1. 准备静态资源

创建前端文件结构：
```
mech-command-center/
├── index.html              # 主控室界面
├── tactical-map.html       # 战术地图
├── roster.html             # 人员名册
├── maintenance.html        # 维修站
├── css/
│   ├── main.css            # 主样式
│   ├── tactical.css        # 战术地图样式
│   └── animations.css      # 动画效果
├── js/
│   ├── main.js             # 主应用
│   ├── mech-manager.js     # 机甲管理
│   ├── pilot-manager.js    # 驾驶员管理
│   ├── mission-control.js  # 任务控制
│   └── radar.js            # 雷达动画
├── assets/
│   ├── mechs/              # 机甲模型图
│   └── icons/              # 图标
└── manifest.json
```

### 2. 配置文件

创建 `pages.config.json`：
```json
{
  "version": 2,
  "routes": [
    {
      "route": "/api/*",
      "target": "function",
      "function": "mech-command-api"
    },
    {
      "route": "/tactical-map",
      "target": "static",
      "spa": true
    },
    {
      "route": "/*",
      "target": "static"
    }
  ],
  "functions": {
    "mech-command-api": {
      "runtime": "nodejs18",
      "entry": "functions/api/index.js"
    }
  },
  "kvNamespaces": [
    {
      "id": "mech-command-kv",
      "variables": ["MECH_COMMAND_KV"]
    }
  ],
  "envVariables": [
    {
      "variableName": "JWT_SECRET",
      "value": "mech-command-jwt-secret-key-alpha"
    }
  ]
}
```

### 3. 部署到 EdgeOne Pages

```bash
# 安装 CLI
npm install -g @cloudflare/edgeone-pages

# 登录并部署
edgeone-pages login
edgeone-pages deploy --directory ./mech-command-center
```

### 4. KV Storage 配置

1. EdgeOne 控制台 → 存储 → KV Storage
2. 创建命名空间：`mech-command-kv`
3. 绑定到 Edge Functions
4. 设置变量名：`MECH_COMMAND_KV`

### 5. 初始数据导入

运行迁移脚本导入机甲和驾驶员示例数据：
```bash
node functions/scripts/init-data.js
```

## 七、认证流程

1. 指挥官使用代号 + 密码登录
2. 验证通过后生成 JWT Token
3. Token 有效期 24 小时
4. 所有 API 请求需携带 Token
5. 权限等级控制操作范围

```javascript
// Token 结构
{
  "userId": "commander-001",
  "userType": "commander",
  "clearance": "alpha",
  "exp": "ISO8601"
}
```

## 八、UI 设计规范

### 配色方案
```
主色:   #00f0ff (青色霓虹)
次色:   #ff3366 (红色警报)
强调:   #00ff88 (绿色就绪)
背景:   #0a0e14 (深空黑)
面板:   #1a1f2e (暗金属灰)
边框:   #2a3142 (边框灰)
文字:   #e0e6ed (亮白)
警告:   #ffaa00 (橙黄)
```

### 动画效果
- 扫描线动画（战损风格）
- 霓虹光晕（就绪状态）
- 数据流粒子（传输动画）
- 警报闪烁（紧急状态）
- 全息投影（详细信息）

### 字体
```css
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;700&display=swap');

.title { font-family: 'Orbitron', sans-serif; }
.body { font-family: 'Rajdhani', sans-serif; }
```

## 九、测试验证

### 测试账号
| 角色 | 代号 | 密码 | 权限 |
|------|------|------|------|
| 指挥官 | COMMANDER_ALPHA | mech2026 | alpha |
| 测试机甲 | MX-01 | 幻影 | - |
| 测试驾驶员 | PILOT_01 | 猎鹰 | - |

### 验证清单

- [ ] 指挥中心界面正常显示
- [ ] 机甲列表加载完整
- [ ] 驾驶员档案可编辑
- [ ] 任务可创建和分配
- [ ] 状态指示器正常工作
- [ ] 警报系统触发正常
- [ ] 战术地图可交互
- [ ] 动画效果流畅

## 十、性能优化

1. **数据缓存**: 常用数据本地缓存
2. **懒加载**: 非关键模块延迟加载
3. **节流**: 状态更新请求节流处理
4. **WebWorker**: 复杂计算移至后台线程

## 十一、安全协议

1. JWT Token 加密存储
2. 操作日志完整记录
3. 敏感操作二次验证
4. 异常访问自动警报
5. 会话超时自动登出

## 十二、扩展计划

- [ ] 3D 机甲模型展示
- [ ] 战场实时模拟
- [ ] 多人协同指挥
- [ ] 历史战斗回放
- [ ] 机甲升级系统
- [ ] 资源管理系统
