# 部署指南

## 快速部署到Netlify

### 方法1：通过GitHub部署（推荐）

1. **创建GitHub仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: 正向HTTP代理服务"
   git branch -M main
   git remote add origin https://github.com/yourusername/http-proxy.git
   git push -u origin main
   ```

2. **在Netlify中部署**
   - 访问 [Netlify](https://netlify.com)
   - 点击 "New site from Git"
   - 选择 GitHub，授权访问
   - 选择你的仓库
   - 构建设置：
     - Build command: 留空
     - Publish directory: `public`
   - 点击 "Deploy site"

3. **获取站点URL**
   - 部署完成后，你会得到一个类似 `https://random-name.netlify.app` 的URL
   - 这个URL就是你的代理服务地址

### 方法2：直接拖拽部署

1. 将整个项目文件夹压缩成ZIP文件
2. 访问 [Netlify](https://netlify.com)
3. 将ZIP文件拖拽到部署区域
4. 等待部署完成

## 验证部署

### 1. 测试Web界面

访问你的Netlify站点URL，应该能看到代理服务的Web界面。

### 2. 运行测试脚本

1. 修改 `test-proxy.js` 中的 `PROXY_BASE_URL`：
   ```javascript
   const PROXY_BASE_URL = 'https://your-site.netlify.app'; // 替换为你的实际URL
   ```

2. 运行测试：
   ```bash
   node test-proxy.js
   ```

### 3. 手动测试

使用curl测试：

```bash
# 测试路径方式
curl "https://your-site.netlify.app/proxy/https://httpbin.org/get"

# 测试参数方式
curl "https://your-site.netlify.app/?url=https://httpbin.org/get"

# 测试POST请求
curl -X POST "https://your-site.netlify.app/proxy/https://httpbin.org/post" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## 自定义域名（可选）

1. 在Netlify控制台点击 "Domain settings"
2. 点击 "Add custom domain"
3. 输入你的域名
4. 按照提示配置DNS记录

## 环境变量配置（可选）

如果需要添加访问控制或其他配置，可以在Netlify控制台设置环境变量：

1. 在Netlify控制台点击 "Site settings"
2. 点击 "Environment variables"
3. 添加变量，例如：
   - `ALLOWED_ORIGINS`: 允许的来源域名
   - `RATE_LIMIT`: 请求频率限制

## 监控和日志

### 查看函数日志

1. 在Netlify控制台点击 "Functions"
2. 点击 "proxy" 函数
3. 查看执行日志

### 监控请求

在Netlify控制台的 "Analytics" 页面可以查看：
- 访问量统计
- 函数执行次数
- 错误率

## 安全建议

1. **添加访问控制**
   - 修改 `functions/proxy.js` 添加域名白名单
   - 设置API密钥验证

2. **限制请求频率**
   - 添加请求频率限制
   - 防止滥用

3. **监控异常**
   - 定期检查函数日志
   - 设置告警通知

## 故障排除

### 部署失败

1. 检查 `netlify.toml` 配置是否正确
2. 确保所有文件都已提交到Git
3. 查看Netlify构建日志

### 函数执行失败

1. 检查函数代码语法
2. 查看函数执行日志
3. 确认路由配置正确

### 代理请求失败

1. 检查目标URL是否可访问
2. 确认网络连接正常
3. 查看函数错误日志

## 更新部署

每次修改代码后：

```bash
git add .
git commit -m "Update: 描述你的修改"
git push origin main
```

Netlify会自动检测到代码更新并重新部署。 