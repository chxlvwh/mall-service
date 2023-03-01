# 环境 -> linux 文件系统
FROM node:16

# 工作目录
WORKDIR /app

# 构建命令
COPY . .

# 暴露目录与端口
VOLUME ["/app/logs"]
EXPOSE 13000

# 运行程序脚本
CMD ["npm", "run", "start:prod"]