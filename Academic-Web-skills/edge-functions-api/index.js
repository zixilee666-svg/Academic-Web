/**
 * Academic Web - Edge Functions API Handler
 * 
 * 完整的用户认证、数据存储和 CRUD 操作
 * 
 * 部署说明:
 * 1. 在 EdgeOne 控制台创建 KV 命名空间
 * 2. 绑定 KV 到 Edge Functions，设置变量名为 "ACADEMIC_HUB_KV"
 * 3. 设置环境变量 JWT_SECRET
 */

// ============================================================
// KV Storage 操作
// ============================================================

let ACADEMIC_HUB_KV = null;

async function kvGet(key) {
  try {
    if (!ACADEMIC_HUB_KV) return null;
    const value = await ACADEMIC_HUB_KV.get(key);
    return value || null;
  } catch (e) {
    console.error('[KV] Get error:', key, e);
    return null;
  }
}

async function kvSet(key, value) {
  try {
    if (!ACADEMIC_HUB_KV) return false;
    await ACADEMIC_HUB_KV.put(key, value);
    return true;
  } catch (e) {
    console.error('[KV] Set error:', key, e);
    return false;
  }
}

async function kvDel(key) {
  try {
    if (!ACADEMIC_HUB_KV) return false;
    await ACADEMIC_HUB_KV.delete(key);
    return true;
  } catch (e) {
    return false;
  }
}

async function kvHas(key) {
  try {
    if (!ACADEMIC_HUB_KV) return false;
    return await ACADEMIC_HUB_KV.get(key) !== null;
  } catch (e) {
    return false;
  }
}

async function kvGetJson(key) {
  const v = await kvGet(key);
  if (!v) return null;
  try { return JSON.parse(v); } catch (e) { return v; }
}

async function kvSetJson(key, value) {
  return kvSet(key, JSON.stringify(value));
}

async function kvListGet(listKey) {
  const list = await kvGetJson(listKey);
  return list || [];
}

async function kvListAdd(listKey, item) {
  const list = await kvListGet(listKey);
  if (!list.includes(item)) {
    list.push(item);
    await kvSetJson(listKey, list);
  }
}

async function kvListRemove(listKey, item) {
  const list = await kvListGet(listKey);
  const idx = list.indexOf(item);
  if (idx > -1) {
    list.splice(idx, 1);
    await kvSetJson(listKey, list);
  }
}

// ============================================================
// 工具函数
// ============================================================

function makeCorsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

function json(data, status = 200, request) {
  const headers = { ...makeCorsHeaders(request), 'Content-Type': 'application/json' };
  return new Response(JSON.stringify(data), { status, headers });
}

function success(data, message = 'Success', request) {
  return json({ success: true, data, message }, 200, request);
}

function apiError(message, status = 400, code = 'ERROR', request) {
  return json({ success: false, error: message, code }, status, request);
}

function unauthorized(request) {
  return apiError('Unauthorized', 401, 'UNAUTHORIZED', request);
}

function forbidden(request) {
  return apiError('Forbidden', 403, 'FORBIDDEN', request);
}

function notFound(message = 'Not found', request) {
  return apiError(message, 404, 'NOT_FOUND', request);
}

function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// ============================================================
// JWT 认证
// ============================================================

function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  return atob(base64);
}

async function createSignature(data, JWT_SECRET) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return base64UrlEncode(String.fromCharCode(...new Uint8Array(signature)));
}

async function createToken(payload, JWT_SECRET) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const hEnc = base64UrlEncode(JSON.stringify(header));
  const now = Date.now();
  const pEnc = base64UrlEncode(JSON.stringify({
    ...payload,
    iat: Math.floor(now / 1000),
    exp: Math.floor((now + 7 * 86400000) / 1000)
  }));
  const sig = await createSignature(hEnc + '.' + pEnc, JWT_SECRET);
  return hEnc + '.' + pEnc + '.' + sig;
}

async function verifyToken(token, JWT_SECRET) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const sigInput = parts[0] + '.' + parts[1];
    const expectedSig = await createSignature(sigInput, JWT_SECRET);
    if (expectedSig !== parts[2]) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

async function requireAuth(request, JWT_SECRET) {
  const auth = request.headers.get('Authorization');
  const token = auth && auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return unauthorized(request);
  const payload = await verifyToken(token, JWT_SECRET);
  if (!payload) return unauthorized(request);
  return payload;
}

async function requireAdmin(request, JWT_SECRET) {
  const payload = await requireAuth(request, JWT_SECRET);
  if (payload instanceof Response) return payload;
  if (payload.role !== 'admin') return forbidden(request);
  return payload;
}

// ============================================================
// 密码处理
// ============================================================

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const salt = 'academic-hub-salt-2026';
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password, hash) {
  return await hashPassword(password) === hash;
}

// ============================================================
// 初始化默认账号
// ============================================================

async function initSystemAccounts(JWT_SECRET) {
  // 初始化管理员
  if (!await kvHas('users:admin')) {
    await kvSetJson('users:admin', {
      id: 'admin',
      username: 'admin',
      displayName: 'Administrator',
      email: 'admin@academic-hub.local',
      passwordHash: await hashPassword('123456'),
      role: 'admin',
      institution: 'Academic Hub',
      createdAt: new Date().toISOString()
    });
    await kvListAdd('users:index', 'admin');
    await kvListAdd('spaces:index', 'admin');
  }

  // 初始化演示账号 Joan
  if (!await kvHas('users:joan')) {
    await kvSetJson('users:joan', {
      id: 'user-joan',
      username: 'joan',
      displayName: 'Joan Chen (贞德)',
      email: 'joan@academic-hub.local',
      passwordHash: await hashPassword('11223344'),
      role: 'user',
      institution: 'Fudan University',
      bio: 'PhD candidate researching Graph Neural Networks and Financial AI.',
      createdAt: '2025-01-01T00:00:00.000Z'
    });
    await kvSet('users:by-username:joan', 'user-joan');
    await kvListAdd('users:index', 'user-joan');
    await kvListAdd('spaces:index', 'joan');

    // Joan 的空间
    await kvSetJson('spaces:joan', {
      username: 'joan',
      displayName: 'Joan Chen (贞德)',
      bio: 'PhD candidate',
      institution: 'Fudan University',
      theme: 'light',
      modules: ['papers', 'projects', 'library'],
      stats: { papers: 3, projects: 2, libraries: 2 }
    });
  }
}

// ============================================================
// 请求处理器
// ============================================================

async function handleLogin(request, JWT_SECRET) {
  if (request.method !== 'POST') return new Response(null, { status: 405 });
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return apiError('Username and password required', 400, 'VALIDATION_ERROR', request);
    }

    const userId = await kvGet('users:by-username:' + username) || (username === 'admin' ? 'admin' : null);
    const user = await kvGetJson('users:' + userId);
    
    if (!user || !await verifyPassword(password, user.passwordHash)) {
      return unauthorized(request);
    }

    const token = await createToken({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET);
    const { passwordHash, ...safeUser } = user;
    return success({ token, user: safeUser }, 'Login successful', request);
  } catch (e) {
    return apiError('Invalid request', 400, 'BAD_REQUEST', request);
  }
}

async function handleRegister(request, JWT_SECRET) {
  if (request.method !== 'POST') return new Response(null, { status: 405 });
  try {
    const { username, password, email, displayName, institution } = await request.json();

    if (!username || !password) {
      return apiError('Username and password required', 400, 'VALIDATION_ERROR', request);
    }

    if (username.length < 3 || username.length > 20) {
      return apiError('Username must be 3-20 characters', 400, 'VALIDATION_ERROR', request);
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(username)) {
      return apiError('Username must start with letter, only letters, numbers, underscore', 400, 'VALIDATION_ERROR', request);
    }

    const reserved = ['admin', 'root', 'joan', 'test'];
    if (reserved.includes(username.toLowerCase())) {
      return apiError('Username reserved', 409, 'CONFLICT', request);
    }

    if (password.length < 6) {
      return apiError('Password must be at least 6 characters', 400, 'VALIDATION_ERROR', request);
    }

    if (await kvHas('users:by-username:' + username)) {
      return apiError('Username already exists', 409, 'CONFLICT', request);
    }

    const userId = generateId('user');
    const user = {
      id: userId,
      username,
      displayName: displayName || username,
      email: email || '',
      institution: institution || '',
      passwordHash: await hashPassword(password),
      role: 'user',
      createdAt: new Date().toISOString()
    };

    await kvSetJson('users:' + userId, user);
    await kvSet('users:by-username:' + username, userId);
    await kvListAdd('users:index', userId);
    await kvListAdd('spaces:index', username);

    await kvSetJson('spaces:' + username, {
      username,
      displayName: user.displayName,
      theme: 'light',
      modules: ['papers', 'projects', 'library'],
      stats: { papers: 0, projects: 0, libraries: 0 }
    });

    await kvSetJson('users:' + userId + ':papers', []);
    await kvSetJson('users:' + userId + ':projects', []);
    await kvSetJson('users:' + userId + ':libraries', []);

    const token = await createToken({ userId, username, role: user.role }, JWT_SECRET);
    const { passwordHash, ...safeUser } = user;
    return success({ token, user: safeUser }, 'Registration successful', request);
  } catch (e) {
    return apiError('Invalid request', 400, 'BAD_REQUEST', request);
  }
}

async function handleGetSpaces() {
  const spaceUsernames = await kvListGet('spaces:index');
  const spaces = [];
  for (const username of spaceUsernames) {
    const space = await kvGetJson('spaces:' + username);
    if (space) {
      spaces.push({
        username: space.username,
        displayName: space.displayName,
        bio: space.bio,
        institution: space.institution,
        stats: space.stats
      });
    }
  }
  return success(spaces);
}

async function handleGetSpace(request, username) {
  const space = await kvGetJson('spaces:' + username);
  if (!space) return notFound('Space not found', request);
  return success(space, 'Success', request);
}

async function handleGetPapers(request, username) {
  const userId = await kvGet('users:by-username:' + username);
  if (!userId) return notFound('User not found', request);
  const paperIds = await kvGetJson('users:' + userId + ':papers') || [];
  const papers = [];
  for (const paperId of paperIds) {
    const paper = await kvGetJson('papers:' + paperId);
    if (paper) papers.push({ id: paper.id, title: paper.title, abstract: paper.abstract, authors: paper.authors, year: paper.year, venue: paper.venue, tags: paper.tags, citations: paper.citations || 0 });
  }
  return success(papers, 'Success', request);
}

async function handleCreatePaper(request, JWT_SECRET) {
  const payload = await requireAuth(request, JWT_SECRET);
  if (payload instanceof Response) return payload;
  try {
    const { title, abstract, authors, year, venue, tags } = await request.json();
    if (!title) return apiError('Title required', 400, 'VALIDATION_ERROR', request);

    const paperId = generateId('paper');
    const paper = { id: paperId, userId: payload.userId, username: payload.username, title, abstract: abstract || '', authors: authors || [], year: year || new Date().getFullYear(), venue: venue || '', tags: tags || [], citations: 0, createdAt: new Date().toISOString() };

    await kvSetJson('papers:' + paperId, paper);
    await kvListAdd('users:' + payload.userId + ':papers', paperId);

    const space = await kvGetJson('spaces:' + payload.username);
    if (space) {
      space.stats.papers = (space.stats.papers || 0) + 1;
      await kvSetJson('spaces:' + payload.username, space);
    }

    return success(paper, 'Paper created', request);
  } catch (e) {
    return apiError('Invalid request', 400, 'BAD_REQUEST', request);
  }
}

async function handleDeletePaper(request, JWT_SECRET, paperId) {
  const payload = await requireAuth(request, JWT_SECRET);
  if (payload instanceof Response) return payload;
  const paper = await kvGetJson('papers:' + paperId);
  if (!paper) return notFound('Paper not found', request);
  if (paper.userId !== payload.userId && payload.role !== 'admin') return forbidden(request);

  await kvDel('papers:' + paperId);
  await kvListRemove('users:' + paper.userId + ':papers', paperId);

  const space = await kvGetJson('spaces:' + paper.username);
  if (space && space.stats.papers > 0) {
    space.stats.papers -= 1;
    await kvSetJson('spaces:' + paper.username, space);
  }

  return success(null, 'Paper deleted', request);
}

async function handleGetProjects(request, username) {
  const userId = await kvGet('users:by-username:' + username);
  if (!userId) return notFound('User not found', request);
  const projectIds = await kvGetJson('users:' + userId + ':projects') || [];
  const projects = [];
  for (const projectId of projectIds) {
    const project = await kvGetJson('projects:' + projectId);
    if (project) projects.push({ id: project.id, name: project.name, description: project.description, status: project.status, progress: project.progress, tags: project.tags });
  }
  return success(projects, 'Success', request);
}

async function handleCreateProject(request, JWT_SECRET) {
  const payload = await requireAuth(request, JWT_SECRET);
  if (payload instanceof Response) return payload;
  try {
    const { name, description, status, progress, tags } = await request.json();
    if (!name) return apiError('Project name required', 400, 'VALIDATION_ERROR', request);

    const projectId = generateId('project');
    const project = { id: projectId, userId: payload.userId, username: payload.username, name, description: description || '', status: status || 'active', progress: progress || 0, tags: tags || [], createdAt: new Date().toISOString() };

    await kvSetJson('projects:' + projectId, project);
    await kvListAdd('users:' + payload.userId + ':projects', projectId);

    const space = await kvGetJson('spaces:' + payload.username);
    if (space) {
      space.stats.projects = (space.stats.projects || 0) + 1;
      await kvSetJson('spaces:' + payload.username, space);
    }

    return success(project, 'Project created', request);
  } catch (e) {
    return apiError('Invalid request', 400, 'BAD_REQUEST', request);
  }
}

async function handleGetLibraries(request, username) {
  const userId = await kvGet('users:by-username:' + username);
  if (!userId) return notFound('User not found', request);
  const libIds = await kvGetJson('users:' + userId + ':libraries') || [];
  const libraries = [];
  for (const libId of libIds) {
    const lib = await kvGetJson('libraries:' + libId);
    if (lib) libraries.push({ id: lib.id, name: lib.name, description: lib.description, paperCount: lib.paperCount || 0, tags: lib.tags });
  }
  return success(libraries, 'Success', request);
}

async function handleCreateLibrary(request, JWT_SECRET) {
  const payload = await requireAuth(request, JWT_SECRET);
  if (payload instanceof Response) return payload;
  try {
    const { name, description, tags } = await request.json();
    if (!name) return apiError('Library name required', 400, 'VALIDATION_ERROR', request);

    const libId = generateId('lib');
    const lib = { id: libId, userId: payload.userId, username: payload.username, name, description: description || '', tags: tags || [], papers: [], paperCount: 0, createdAt: new Date().toISOString() };

    await kvSetJson('libraries:' + libId, lib);
    await kvListAdd('users:' + payload.userId + ':libraries', libId);

    const space = await kvGetJson('spaces:' + payload.username);
    if (space) {
      space.stats.libraries = (space.stats.libraries || 0) + 1;
      await kvSetJson('spaces:' + payload.username, space);
    }

    return success(lib, 'Library created', request);
  } catch (e) {
    return apiError('Invalid request', 400, 'BAD_REQUEST', request);
  }
}

async function handleMe(request, JWT_SECRET) {
  const payload = await requireAuth(request, JWT_SECRET);
  if (payload instanceof Response) return payload;
  const user = await kvGetJson('users:' + payload.userId);
  if (!user) return notFound('User not found', request);
  const { passwordHash, ...safeUser } = user;
  return success(safeUser, 'Success', request);
}

// ============================================================
// 主入口
// ============================================================

export async function onRequest(context) {
  const { request, env } = context;

  // 初始化 KV
  ACADEMIC_HUB_KV = env.ACADEMIC_HUB_KV;
  const JWT_SECRET = env.JWT_SECRET || 'academic-hub-default-secret-key-2026';

  // 初始化系统账号
  await initSystemAccounts(JWT_SECRET);

  // CORS 预检
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: makeCorsHeaders(request) });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, '') || '/';
  const segments = path.split('/').filter(Boolean);

  // 路由分发
  if (segments[0] === 'auth') {
    if (segments[1] === 'login') return handleLogin(request, JWT_SECRET);
    if (segments[1] === 'register') return handleRegister(request, JWT_SECRET);
    if (segments[1] === 'me') return handleMe(request, JWT_SECRET);
  }

  if (segments[0] === 'spaces') {
    if (segments.length === 1) return handleGetSpaces();
    if (segments.length === 2) return handleGetSpace(request, segments[1]);
  }

  if (segments[0] === 'papers' && request.method === 'POST') return handleCreatePaper(request, JWT_SECRET);
  if (segments[0] === 'papers' && segments.length === 2 && request.method === 'DELETE') return handleDeletePaper(request, JWT_SECRET, segments[1]);

  if (segments[0] === 'users' && segments[2] === 'papers') return handleGetPapers(request, segments[1]);

  if (segments[0] === 'projects' && request.method === 'POST') return handleCreateProject(request, JWT_SECRET);
  if (segments[0] === 'users' && segments[2] === 'projects') return handleGetProjects(request, segments[1]);

  if (segments[0] === 'libraries' && request.method === 'POST') return handleCreateLibrary(request, JWT_SECRET);
  if (segments[0] === 'users' && segments[2] === 'libraries') return handleGetLibraries(request, segments[1]);

  // 健康检查
  if (path === '/hello') return success({ message: 'Academic Web API', version: '1.0.0' }, 'Success', request);

  return notFound('Not found', request);
}
