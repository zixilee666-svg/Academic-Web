/**
 * Academic Web 数据迁移脚本
 * 用于初始化 KV Storage 数据
 * 
 * 使用方法:
 * node migrate.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

// 读取示例数据
const sampleData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'sample-data.json'), 'utf-8')
);

// 简单密码哈希
async function hashPassword(password) {
  const salt = 'academic-hub-salt-2026';
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// 迁移函数
async function migrate(KV) {
  console.log('开始数据迁移...\n');

  // 1. 初始化管理员账号
  console.log('[1/5] 初始化管理员账号...');
  const adminPasswordHash = await hashPassword('123456');
  await KV.put('users:admin', JSON.stringify({
    id: 'admin',
    username: 'admin',
    displayName: 'Administrator',
    email: 'admin@academic-hub.local',
    passwordHash: adminPasswordHash,
    role: 'admin',
    institution: 'Joan Academic Hub',
    createdAt: new Date().toISOString()
  }));
  await KV.put('users:index', JSON.stringify(['admin']));
  await KV.put('spaces:index', JSON.stringify(['admin']));
  console.log('✓ 管理员账号已创建 (admin/123456)');

  // 2. 初始化 Joan 账号
  console.log('\n[2/5] 初始化 Joan 演示账号...');
  const joanPasswordHash = await hashPassword('11223344');
  await KV.put('users:joan', JSON.stringify({
    id: 'user-joan',
    username: 'joan',
    displayName: 'Joan Chen (贞德)',
    email: 'joan@academic-hub.local',
    passwordHash: joanPasswordHash,
    role: 'user',
    institution: 'Fudan University',
    bio: 'PhD candidate researching Graph Neural Networks and Financial AI.',
    createdAt: '2025-01-01T00:00:00.000Z'
  }));
  await KV.put('users:by-username:joan', 'user-joan');
  await KV.put('users:index', JSON.stringify(['admin', 'user-joan']));
  console.log('✓ Joan 账号已创建 (joan/11223344)');

  // 3. 初始化 Joan 空间
  console.log('\n[3/5] 初始化 Joan 学术空间...');
  await KV.put('spaces:joan', JSON.stringify(sampleData.spaces.joan));
  await KV.put('spaces:index', JSON.stringify(['admin', 'joan']));
  console.log('✓ Joan 学术空间已创建');

  // 4. 初始化 Joan 的论文
  console.log('\n[4/5] 初始化 Joan 的论文...');
  const joanPapers = sampleData.papers.map(p => ({
    ...p,
    userId: 'user-joan',
    username: 'joan',
    createdAt: new Date().toISOString()
  }));
  
  for (const paper of joanPapers) {
    await KV.put(`papers:${paper.id}`, JSON.stringify(paper));
  }
  await KV.put('users:user-joan:papers', JSON.stringify(joanPapers.map(p => p.id)));
  console.log(`✓ ${joanPapers.length} 篇论文已创建`);

  // 5. 初始化 Joan 的项目和文献库
  console.log('\n[5/5] 初始化 Joan 的项目和文献库...');
  
  const joanProjects = sampleData.projects.map(p => ({
    ...p,
    userId: 'user-joan',
    username: 'joan',
    createdAt: new Date().toISOString()
  }));
  
  for (const project of joanProjects) {
    await KV.put(`projects:${project.id}`, JSON.stringify(project));
  }
  await KV.put('users:user-joan:projects', JSON.stringify(joanProjects.map(p => p.id)));
  console.log(`✓ ${joanProjects.length} 个项目已创建`);

  const joanLibraries = sampleData.libraries.map(l => ({
    ...l,
    userId: 'user-joan',
    username: 'joan',
    createdAt: new Date().toISOString()
  }));
  
  for (const lib of joanLibraries) {
    await KV.put(`libraries:${lib.id}`, JSON.stringify(lib));
  }
  await KV.put('users:user-joan:libraries', JSON.stringify(joanLibraries.map(l => l.id)));
  console.log(`✓ ${joanLibraries.length} 个文献库已创建`);

  console.log('\n==========================================');
  console.log('数据迁移完成!');
  console.log('==========================================');
  console.log('\n测试账号:');
  console.log('  管理员: admin / 123456');
  console.log('  演示用户: joan / 11223344');
}

// 主函数
async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  
  if (isDryRun) {
    console.log('Dry Run 模式 - 仅显示将要创建的数据\n');
  }

  try {
    if (isDryRun) {
      console.log('将创建以下数据:');
      console.log(JSON.stringify(sampleData, null, 2));
    } else {
      // 注意: 实际使用需要在 EdgeOne 控制台配置 KV Storage
      // 这里只是一个示例脚本
      console.log('请在 EdgeOne 控制台手动配置 KV Storage');
      console.log('或使用 Edge Functions 的初始化逻辑');
    }
  } catch (error) {
    console.error('迁移失败:', error);
    process.exit(1);
  }
}

main();
