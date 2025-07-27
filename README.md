# 标准HTTP代理服务

这是一个基于Netlify Functions的标准HTTP代理服务，支持环境变量和curl -x参数。

## 功能特性

- ✅ 支持所有HTTP方法（GET、POST、PUT、DELETE等）
- ✅ 自动处理请求头和响应头
- ✅ 支持请求体转发
- ✅ CORS支持
- ✅ 错误处理和超时控制
- ✅ 美观的Web界面
- ✅ 实时响应显示

## 快速开始

### 1. 部署到Netlify

1. 将代码推送到GitHub仓库
2. 在Netlify中连接你的GitHub仓库
3. 构建设置：
   - 构建命令：留空
   - 发布目录：`public`
4. 点击"部署站点"

### 2. 使用方法

#### 通过Web界面

访问你的Netlify站点，使用内置的Web界面测试代理功能。

#### 使用方法

**环境变量方式（推荐）：**
```bash
# 设置代理
export https_proxy="https://your-site.netlify.app"
export http_proxy="https://your-site.netlify.app"

# 正常使用curl
curl "https://api.github.com/users/octocat"
curl "https://httpbin.org/get"

# 取消代理设置
unset https_proxy http_proxy
```

**curl -x参数方式：**
```bash
curl -x https://your-site.netlify.app https://api.github.com/users/octocat
curl -x https://your-site.netlify.app https://httpbin.org/get
```

**自定义请求头方式：**
```bash
curl -H "x-request-line: GET https://httpbin.org/get HTTP/1.1" \
     "https://your-site.netlify.app/.netlify/functions/proxy"
```

#### 功能说明

- **环境变量**：`https_proxy` 和 `http_proxy`
- **curl -x参数**：直接指定代理服务器
- **自定义请求头**：使用 `x-request-line` 头
- 支持所有HTTP方法
- 自动转发请求头和请求体

## 项目结构

```
http_proxy/
├── netlify.toml          # Netlify配置文件
├── functions/
│   └── proxy.js         # 代理函数
├── public/
│   └── index.html       # Web界面
└── README.md            # 项目说明
```

## 配置说明

### netlify.toml

```toml
[build]
  functions = "functions"
  publish = "public"

[[redirects]]
  from = "/proxy/*"
  to = "/.netlify/functions/proxy"
  status = 200

[[redirects]]
  from = "/*"
  to = "/.netlify/functions/proxy"
  status = 200
```

### 代理函数特性

- **请求转发**：自动解析目标URL并转发请求
- **头部处理**：智能过滤和转发HTTP头部
- **错误处理**：完善的错误处理和超时控制
- **CORS支持**：自动添加CORS头部
- **日志记录**：记录请求和错误信息

## 使用示例

### 1. 获取GitHub用户信息

```bash
# 环境变量方式（推荐）
export https_proxy="https://your-site.netlify.app"
curl "https://api.github.com/users/octocat"
unset https_proxy

# curl -x参数方式
curl -x https://your-site.netlify.app https://api.github.com/users/octocat
```

### 2. 发送POST请求

```bash
# 环境变量方式
export https_proxy="https://your-site.netlify.app"
curl -X POST "https://httpbin.org/post" \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "value": 123}'
unset https_proxy

# curl -x参数方式
curl -x https://your-site.netlify.app -X POST "https://httpbin.org/post" \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "value": 123}'
```

### 3. 获取图片

```bash
# 环境变量方式
export https_proxy="https://your-site.netlify.app"
curl "https://httpbin.org/image/png" -o image.png
unset https_proxy

# curl -x参数方式
curl -x https://your-site.netlify.app "https://httpbin.org/image/png" -o image.png
```

### 4. 批量使用代理

```bash
# 设置代理
export https_proxy="https://your-site.netlify.app"
export http_proxy="https://your-site.netlify.app"

# 批量请求
curl "https://httpbin.org/get"
curl "https://api.github.com/users/octocat"
curl "https://httpbin.org/image/png" -o image.png

# 取消代理设置
unset https_proxy http_proxy
```

## 安全注意事项

⚠️ **重要提醒**：

1. 此代理服务会转发所有请求，请谨慎使用
2. 建议添加访问控制或白名单机制
3. 避免代理敏感数据或内部服务
4. 考虑添加请求频率限制

## 自定义配置

### 添加访问控制

在`functions/proxy.js`中添加：

```javascript
// 检查来源域名
const allowedOrigins = ['https://yourdomain.com'];
const origin = event.headers.origin || event.headers.referer;

if (!allowedOrigins.some(allowed => origin?.includes(allowed))) {
  return {
    statusCode: 403,
    body: JSON.stringify({ error: '访问被拒绝' })
  };
}
```

### 添加请求频率限制

```javascript
// 简单的内存缓存（生产环境建议使用Redis）
const requestCounts = new Map();

const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'];
const now = Date.now();
const windowMs = 60000; // 1分钟

if (requestCounts.has(clientIP)) {
  const { count, resetTime } = requestCounts.get(clientIP);
  if (now < resetTime) {
    if (count > 100) { // 每分钟最多100次请求
      return {
        statusCode: 429,
        body: JSON.stringify({ error: '请求过于频繁' })
      };
    }
    requestCounts.set(clientIP, { count: count + 1, resetTime });
  } else {
    requestCounts.set(clientIP, { count: 1, resetTime: now + windowMs });
  }
} else {
  requestCounts.set(clientIP, { count: 1, resetTime: now + windowMs });
}
```

## 测试

### 运行测试脚本

1. 修改 `test-proxy.js` 中的 `PROXY_BASE_URL` 为你的实际Netlify站点URL
2. 运行测试：

```bash
node test-proxy.js
```

测试脚本会验证：
- 路径方式的GET请求
- 参数方式的GET请求  
- POST请求
- GitHub API访问

## 故障排除

### 部署问题

#### "Page not found" 错误

如果部署后看到"Page not found"错误，请按以下步骤检查：

1. **运行检查脚本**：
   ```bash
   bash check-deployment.sh
   ```

2. **检查Netlify控制台设置**：
   - 访问 https://app.netlify.com
   - 点击你的站点
   - 进入 "Site settings" -> "Build & deploy"
   - 确保以下设置正确：
     * **Build command**: 留空
     * **Publish directory**: `public`
     * **Functions directory**: `functions`

3. **检查文件结构**：
   ```
   http_proxy/
   ├── netlify.toml          # Netlify配置文件
   ├── functions/
   │   └── proxy.js         # 代理函数
   ├── public/
   │   ├── index.html       # 主页面
   │   └── test.html        # 测试页面
   └── README.md            # 项目说明
   ```

4. **测试部署**：
   - 访问你的站点根URL：`https://your-site.netlify.app/`
   - 访问测试页面：`https://your-site.netlify.app/test.html`
   - 测试函数：`https://your-site.netlify.app/.netlify/functions/proxy`

5. **重新部署步骤**：
   - 删除当前站点
   - 重新拖拽文件夹到Netlify
   - 等待部署完成
   - 检查部署日志

6. **获取调试信息**：
   - 在浏览器开发者工具中查看网络请求
   - 查找响应头中的 `x-nf-request-id`
   - 提供完整的错误URL和时间戳

7. **参考官方文档**：
   [Netlify Support Guide](https://answers.netlify.com/t/support-guide-i-ve-deployed-my-site-but-i-still-see-page-not-found/125/11)

### 代理功能问题

1. **CORS错误**：确保目标服务器允许跨域请求
2. **超时错误**：目标服务器响应时间过长，默认超时30秒
3. **404错误**：检查目标URL是否正确
4. **500错误**：查看Netlify函数日志

### 查看日志

在Netlify控制台的"Functions"页面查看函数执行日志。

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request！ 