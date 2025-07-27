#!/bin/bash

echo "🚀 Netlify部署脚本"
echo "=================="
echo ""

# 检查当前目录结构
echo "📁 当前目录结构："
ls -la
echo ""

# 检查public目录
if [ -d "public" ]; then
    echo "✅ public目录存在"
    echo "public目录内容："
    ls -la public/
    echo ""
else
    echo "❌ public目录不存在"
    exit 1
fi

# 检查functions目录
if [ -d "functions" ]; then
    echo "✅ functions目录存在"
    echo "functions目录内容："
    ls -la functions/
    echo ""
else
    echo "❌ functions目录不存在"
    exit 1
fi

# 检查netlify.toml
if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml存在"
    echo "netlify.toml内容："
    cat netlify.toml
    echo ""
else
    echo "❌ netlify.toml不存在"
    exit 1
fi

echo "🔧 部署说明："
echo "============="
echo ""
echo "1. 将整个项目文件夹拖拽到Netlify"
echo "2. 在部署设置中确保："
echo "   - Build command: 留空"
echo "   - Publish directory: public"
echo "   - Functions directory: functions"
echo ""
echo "3. 部署完成后，应该能够访问："
echo "   - 主页面: https://your-site.netlify.app/"
echo "   - 测试页面: https://your-site.netlify.app/test.html"
echo "   - 函数: https://your-site.netlify.app/.netlify/functions/proxy"
echo ""
echo "4. 如果仍然只能通过 /public/ 访问，请："
echo "   - 在Netlify控制台手动设置Publish directory为public"
echo "   - 或者重新创建部署"
echo ""

echo "📋 文件结构验证："
echo "=================="
echo ""

# 验证关键文件
echo "检查关键文件："
if [ -f "public/index.html" ]; then
    echo "✅ public/index.html 存在"
else
    echo "❌ public/index.html 不存在"
fi

if [ -f "functions/proxy.js" ]; then
    echo "✅ functions/proxy.js 存在"
else
    echo "❌ functions/proxy.js 不存在"
fi

if [ -f "public/test.html" ]; then
    echo "✅ public/test.html 存在"
else
    echo "❌ public/test.html 不存在"
fi

echo ""
echo "🎯 预期部署结果："
echo "================"
echo "部署成功后，你的站点结构应该是："
echo ""
echo "https://your-site.netlify.app/"
echo "├── / (根路径，显示index.html)"
echo "├── /test.html (测试页面)"
echo "├── /.netlify/functions/proxy (代理函数)"
echo "└── /assets/* (静态资源，如果有)"
echo ""
echo "而不是："
echo "https://your-site.netlify.app/"
echo "├── /public/ (当前错误的路径)"
echo "├── /functions/"
echo "├── /README.md"
echo "└── /netlify.toml"
echo "" 