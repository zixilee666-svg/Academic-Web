#!/bin/bash

# Academic Web 部署验证脚本

set -e

echo "=========================================="
echo "Academic Web 部署验证"
echo "=========================================="

# 获取部署URL
DEPLOY_URL=${1:-""}

if [ -z "$DEPLOY_URL" ]; then
    echo "请提供部署URL: ./verify.sh https://your-project.edgeone.page"
    exit 1
fi

echo ""
echo "测试项目: $DEPLOY_URL"
echo ""

# 测试1: 主页访问
echo "[1/5] 测试主页访问..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ 主页访问成功"
else
    echo "✗ 主页访问失败 (HTTP $HTTP_CODE)"
fi

# 测试2: API 健康检查
echo ""
echo "[2/5] 测试 API 健康检查..."
API_RESPONSE=$(curl -s "$DEPLOY_URL/api/hello" 2>/dev/null || echo "")
if echo "$API_RESPONSE" | grep -q "success"; then
    echo "✓ API 健康检查通过"
else
    echo "✗ API 健康检查失败"
    echo "响应: $API_RESPONSE"
fi

# 测试3: 用户注册
echo ""
echo "[3/5] 测试用户注册..."
REGISTER_RESPONSE=$(curl -s -X POST "$DEPLOY_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"username":"testuser","password":"Test1234"}' 2>/dev/null || echo "")
if echo "$REGISTER_RESPONSE" | grep -q "success"; then
    echo "✓ 用户注册成功"
else
    echo "✗ 用户注册失败"
    echo "响应: $REGISTER_RESPONSE"
fi

# 测试4: 用户登录
echo ""
echo "[4/5] 测试用户登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$DEPLOY_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"joan","password":"11223344"}' 2>/dev/null || echo "")
if echo "$LOGIN_RESPONSE" | grep -q "success"; then
    echo "✓ 用户登录成功"
else
    echo "✗ 用户登录失败"
    echo "响应: $LOGIN_RESPONSE"
fi

# 测试5: 获取空间列表
echo ""
echo "[5/5] 测试获取空间列表..."
SPACES_RESPONSE=$(curl -s "$DEPLOY_URL/api/spaces" 2>/dev/null || echo "")
if echo "$SPACES_RESPONSE" | grep -q "success"; then
    echo "✓ 获取空间列表成功"
else
    echo "✗ 获取空间列表失败"
    echo "响应: $SPACES_RESPONSE"
fi

echo ""
echo "=========================================="
echo "验证完成"
echo "=========================================="
