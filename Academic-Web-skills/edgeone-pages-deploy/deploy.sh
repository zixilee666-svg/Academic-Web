#!/bin/bash

# Academic Web EdgeOne Pages 部署脚本

set -e

echo "=========================================="
echo "Academic Web 部署开始"
echo "=========================================="

# 检查 node 和 npm
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "错误: npm 未安装"
    exit 1
fi

# 检查 edgeone CLI
if ! command -v edgeone &> /dev/null; then
    echo "正在安装 edgeone CLI..."
    npm install -g @edgeone/cli
fi

echo ""
echo "[1/4] 安装依赖..."
npm install

echo ""
echo "[2/4] 构建项目..."
npm run build

echo ""
echo "[3/4] 验证构建输出..."
if [ ! -d "./dist" ]; then
    echo "错误: 构建输出目录不存在"
    exit 1
fi

echo ""
echo "[4/4] 部署到 EdgeOne Pages..."
edgeone pages deploy

echo ""
echo "=========================================="
echo "部署完成!"
echo "=========================================="
echo ""
echo "下一步:"
echo "1. 在 EdgeOne 控制台绑定 KV Storage"
echo "2. 设置环境变量"
echo "3. 验证部署"
