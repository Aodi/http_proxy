#!/bin/bash

# Netlify部署调试脚本
# 根据 https://answers.netlify.com/t/support-guide-i-ve-deployed-my-site-but-i-still-see-page-not-found/125/11

echo "🔍 Netlify部署调试工具"
echo "========================"
echo ""

# 检查必要的文件
echo "📁 检查项目文件结构："
echo ""

if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml 存在"
    echo "内容预览："
    head -10 netlify.toml
    echo ""
else
    echo "❌ netlify.toml 不存在"
fi

if [ -d "functions" ]; then
    echo "✅ functions 目录存在"
    if [ -f "functions/proxy.js" ]; then
        echo "✅ functions/proxy.js 存在"
    else
        echo "❌ functions/proxy.js 不存在"
    fi
else
    echo "❌ functions 目录不存在"
fi

if [ -d "public" ]; then
    echo "✅ public 目录存在"
    if [ -f "public/index.html" ]; then
        echo "✅ public/index.html 存在"
    else
        echo "❌ public/index.html 不存在"
    fi
else
    echo "❌ public 目录不存在"
fi

echo ""
echo "🔧 部署检查清单："
echo "=================="
echo ""

echo "1. 确保以下文件已提交到Git："
echo "   - netlify.toml"
echo "   - functions/proxy.js"
echo "   - public/index.html"
echo ""

echo "2. 在Netlify控制台检查："
echo "   - 构建命令是否为空"
echo "   - 发布目录是否设置为 'public'"
echo "   - 函数目录是否设置为 'functions'"
echo ""

echo "3. 检查部署日志："
echo "   - 访问 Netlify 控制台"
echo "   - 点击你的站点"
echo "   - 查看 'Deploys' 标签页"
echo "   - 检查最新的部署日志"
echo ""

echo "4. 测试部署："
echo "   - 访问你的站点根URL"
echo "   - 应该看到代理服务的Web界面"
echo "   - 如果看到404，检查上述配置"
echo ""

echo "5. 获取 x-nf-request-id："
echo "   - 在浏览器开发者工具中查看网络请求"
echo "   - 查找响应头中的 'x-nf-request-id'"
echo "   - 这个ID可以帮助Netlify支持团队调试问题"
echo ""

echo "🚀 快速测试命令："
echo "=================="
echo ""

echo "# 测试根路径（应该显示Web界面）"
echo "curl -I https://your-site.netlify.app/"
echo ""

echo "# 测试代理功能"
echo "curl https://your-site.netlify.app/proxy/https://httpbin.org/get"
echo ""

echo "# 测试函数直接调用"
echo "curl https://your-site.netlify.app/.netlify/functions/proxy?url=https://httpbin.org/get"
echo ""

echo "📞 如果问题仍然存在："
echo "======================"
echo "1. 收集 x-nf-request-id 头信息"
echo "2. 提供完整的错误URL"
echo "3. 提供部署日志截图"
echo "4. 联系 Netlify 支持团队"
echo ""

echo "🔗 参考文档："
echo "https://answers.netlify.com/t/support-guide-i-ve-deployed-my-site-but-i-still-see-page-not-found/125/11" 