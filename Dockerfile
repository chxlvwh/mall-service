# 环境 -> linux 文件系统
FROM node:16

# 工作目录
WORKDIR /app

# 构建命令
COPY . .

# 安装依赖
RUN npm install --registry=https://registry.npm.taobao.org

# 构建项目
RUN npm run build

# 启动命令
CMD ["npm", "run", "start:prod"]

# 暴露目录与端口
VOLUME ["/app/logs"]
EXPOSE 13000
