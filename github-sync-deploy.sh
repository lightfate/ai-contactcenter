#!/bin/bash

# 设置变量
REPO_URL="https://github.com/lightfate/ai-contactcenter.git"  # 例如：https://github.com/username/repo.git
BRANCH="main"  # 设置需要拉取的分支名称
APP_NAME="cxaas-app"  # PM2 应用名称
LOCAL_DIR="/root/workspace/ai-contactcenter"  # 当前工作目录

# 输出彩色日志
function log() {
  echo -e "\e[1;36m[$(date '+%Y-%m-%d %H:%M:%S')]\e[0m \e[1;32m$1\e[0m"
}

# 错误处理
function handle_error() {
  echo -e "\e[1;31m错误: $1\e[0m"
  exit 1
}

# 检查是否已经初始化了Git仓库
if [ ! -d ".git" ]; then
  log "初始化Git仓库并添加远程源..."
  git init || handle_error "Git初始化失败"
  git remote add origin $REPO_URL || handle_error "添加远程源失败"
fi

# 保存当前的更改（如果有）
log "保存当前的本地更改..."
git stash || log "没有需要保存的更改或Git stash失败"

# 拉取最新代码
log "拉取最新代码..."
git fetch origin $BRANCH || handle_error "拉取代码失败"
git checkout $BRANCH || handle_error "切换分支失败"
git reset --hard origin/$BRANCH || handle_error "重置到远程分支失败"

# 安装依赖
log "安装项目依赖..."
npm install || handle_error "依赖安装失败"

# 构建项目
log "构建项目..."
npm run build || handle_error "项目构建失败"

# # 检查PM2是否已安装
# if ! command -v pm2 &> /dev/null; then
#   log "安装PM2..."
#   npm install -g pm2 || handle_error "PM2安装失败"
# fi

# 使用PM2重启应用
log "使用PM2部署应用..."
if pm2 list | grep -q "$APP_NAME"; then
  log "停止旧的应用实例..."
  pm2 stop $APP_NAME || handle_error "停止应用失败"
  pm2 delete $APP_NAME || handle_error "删除应用失败"
fi

log "启动新的应用实例..."
pm2 start npm --name "$APP_NAME" -- run start -- --port 50010 || handle_error "启动应用失败"

# 保存PM2进程列表，以便在系统重启时自动恢复
pm2 save || log "PM2保存进程列表失败"

log "部署完成！应用已成功在端口50010上运行"
log "可以通过 'pm2 logs $APP_NAME' 查看应用日志"
log "可以通过 'pm2 monit' 监控应用状态" 