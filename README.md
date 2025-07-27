# TheMovieDB 反向代理

基于 Netlify Functions 的 TheMovieDB API 反向代理服务。

## 功能特性

- 🔄 **自动转发**：所有请求自动代理到 `api.themoviedb.org`
- 📡 **完整支持**：保留路径、参数、请求头、请求体
- 🌐 **CORS 支持**：支持跨域请求
- ⚡ **快速部署**：基于 Netlify Functions，无需服务器

## 部署

1. **Fork 或克隆此仓库**
2. **部署到 Netlify**
   - 连接 GitHub 仓库
   - 或直接拖拽文件夹到 Netlify
3. **配置重定向规则**（已在 `netlify.toml` 中配置）

## 使用方法

### 基本用法

将你的 TheMovieDB API 请求发送到代理端点：

```bash
# 获取电影信息
curl "https://your-site.netlify.app/.netlify/functions/proxy/3/movie/550?api_key=YOUR_API_KEY"

# 搜索电影
curl "https://your-site.netlify.app/.netlify/functions/proxy/3/search/movie?api_key=YOUR_API_KEY&query=inception"
```

### 带认证的请求

```bash
# 使用 Bearer Token
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     "https://your-site.netlify.app/.netlify/functions/proxy/3/account"

# POST 请求
curl -X POST \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"media_type":"movie","media_id":550,"favorite":true}' \
     "https://your-site.netlify.app/.netlify/functions/proxy/3/account/YOUR_ACCOUNT_ID/favorite"
```

## 项目结构

```
├── functions/
│   └── proxy.js          # 代理函数
├── public/
│   └── index.html        # 说明页面
├── netlify.toml          # Netlify 配置
└── README.md            # 项目说明
```

## 注意事项

- 需要有效的 TheMovieDB API 密钥或访问令牌
- 遵循 TheMovieDB API 的使用条款和速率限制
- 代理仅用于开发测试，生产环境请直接使用官方 API

## 获取 API 密钥

1. 访问 [TheMovieDB](https://www.themoviedb.org/)
2. 注册账户并登录
3. 在设置页面申请 API 密钥
4. 获取 API Key 或 Access Token

## 许可证

MIT License 