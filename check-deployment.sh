#!/bin/bash

echo "🔍 Netlify部署检查工具"
echo "======================"
echo ""

# 检查项目结构
echo "📁 检查项目结构："
echo ""

if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml 存在"
    echo "内容："
    cat netlify.toml
    echo ""
else
    echo "❌ netlify.toml 不存在"
fi

if [ -d "public" ]; then
    echo "✅ public 目录存在"
    if [ -f "public/index.html" ]; then
        echo "✅ public/index.html 存在"
        echo "文件大小: $(ls -lh public/index.html | awk '{print $5}')"
    else
        echo "❌ public/index.html 不存在"
    fi
else
    echo "❌ public 目录不存在"
fi

if [ -d "functions" ]; then
    echo "✅ functions 目录存在"
    if [ -f "functions/proxy.js" ]; then
        echo "✅ functions/proxy.js 存在"
        echo "文件大小: $(ls -lh functions/proxy.js | awk '{print $5}')"
    else
        echo "❌ functions/proxy.js 不存在"
    fi
else
    echo "❌ functions 目录不存在"
fi

echo ""
echo "🔧 部署问题诊断："
echo "=================="
echo ""

echo "1. 检查Netlify控制台设置："
echo "   - 访问 https://app.netlify.com"
echo "   - 点击你的站点"
echo "   - 检查 'Site settings' -> 'Build & deploy'"
echo "   - 确保以下设置正确："
echo "     * Build command: 留空"
echo "     * Publish directory: public"
echo "     * Functions directory: functions"
echo ""

echo "2. 检查部署日志："
echo "   - 在Netlify控制台点击 'Deploys' 标签"
echo "   - 查看最新的部署日志"
echo "   - 检查是否有错误信息"
echo ""

echo "3. 测试部署："
echo "   - 访问你的站点根URL"
echo "   - 应该看到代理服务的说明页面"
echo "   - 如果看到404，继续下面的检查"
echo ""

echo "4. 手动测试函数："
echo "   - 访问: https://your-site.netlify.app/.netlify/functions/proxy"
echo "   - 应该看到错误信息（缺少目标URL）"
echo "   - 如果看到404，说明函数没有正确部署"
echo ""

echo "5. 重新部署步骤："
echo "   a. 确保所有文件都已包含在压缩包中"
echo "   b. 重新拖拽文件夹到Netlify"
echo "   c. 等待部署完成"
echo "   d. 检查部署日志"
echo ""

echo "6. 常见问题："
echo "   - 文件夹名称没有要求，但确保包含所有必要文件"
echo "   - 确保netlify.toml在根目录"
echo "   - 确保public/index.html存在"
echo "   - 确保functions/proxy.js存在"
echo ""

echo "🚀 快速修复建议："
echo "=================="
echo ""

echo "1. 创建新的部署："
echo "   - 删除当前站点"
echo "   - 重新拖拽文件夹"
echo "   - 使用新的站点URL"
echo ""

echo "2. 检查文件权限："
echo "   - 确保所有文件可读"
echo "   - 确保目录结构正确"
echo ""

echo "3. 验证压缩包："
echo "   - 解压后检查文件结构"
echo "   - 确保没有隐藏文件问题"
echo ""

echo "📞 如果问题仍然存在："
echo "======================"
echo "1. 提供你的Netlify站点URL"
echo "2. 提供部署日志截图"
echo "3. 提供错误页面的x-nf-request-id"
echo "4. 联系Netlify支持团队"
echo ""

echo "🔗 参考文档："
echo "https://answers.netlify.com/t/support-guide-i-ve-deployed-my-site-but-i-still-see-page-not-found/125/11" 