#!/bin/bash

# 标准HTTP代理使用示例
# 请将 YOUR_SITE_URL 替换为你的实际Netlify站点URL

PROXY_URL="https://your-site.netlify.app"

echo "🚀 标准HTTP代理使用示例"
echo "代理服务器: $PROXY_URL"
echo ""

echo "📋 方法1: 使用环境变量（推荐）"
echo "export https_proxy=\"$PROXY_URL\""
echo "export http_proxy=\"$PROXY_URL\""
echo "curl \"https://httpbin.org/get\""
echo "unset https_proxy http_proxy"
echo ""

echo "📋 方法2: 使用curl -x参数"
echo "curl -x $PROXY_URL https://httpbin.org/get"
echo ""

echo "📋 方法3: 使用自定义请求头"
echo "curl -H \"x-request-line: GET https://httpbin.org/get HTTP/1.1\" \\"
echo "     \"$PROXY_URL/.netlify/functions/proxy\""
echo ""

echo "🔧 实际测试命令："
echo ""

# 测试命令
echo "1. 测试GET请求："
echo "curl -x $PROXY_URL https://httpbin.org/get"
echo ""

echo "2. 测试POST请求："
echo "curl -x $PROXY_URL -X POST https://httpbin.org/post \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"test\": \"data\"}'"
echo ""

echo "3. 测试GitHub API："
echo "curl -x $PROXY_URL https://api.github.com/users/octocat"
echo ""

echo "4. 测试图片下载："
echo "curl -x $PROXY_URL https://httpbin.org/image/png -o test-image.png"
echo ""

echo "5. 使用环境变量方式："
echo "export https_proxy=\"$PROXY_URL\""
echo "curl \"https://httpbin.org/get\""
echo "curl \"https://api.github.com/users/octocat\""
echo "unset https_proxy"
echo ""

echo "⚠️  注意事项："
echo "- 某些HTTPS网站可能不完全支持代理"
echo "- 建议使用环境变量方式设置代理"
echo "- 请合理使用代理服务，遵守相关法律法规"
echo ""

echo "🔗 更多信息请查看 README.md" 