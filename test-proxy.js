const https = require('https');
const http = require('http');
const { URL } = require('url');

// 测试配置
const PROXY_BASE_URL = 'https://your-site.netlify.app'; // 替换为你的Netlify站点URL

// 测试用例
const testCases = [
  {
    name: '标准HTTP代理格式测试',
    method: 'GET',
    url: `${PROXY_BASE_URL}/.netlify/functions/proxy`,
    headers: { 
      'Content-Type': 'application/json',
      'x-request-line': 'GET https://httpbin.org/get HTTP/1.1'
    },
    expectedStatus: 200
  },
  {
    name: 'POST请求测试',
    method: 'POST',
    url: `${PROXY_BASE_URL}/.netlify/functions/proxy`,
    headers: { 
      'Content-Type': 'application/json',
      'x-request-line': 'POST https://httpbin.org/post HTTP/1.1'
    },
    body: JSON.stringify({ test: 'data', number: 123 }),
    expectedStatus: 200
  },
  {
    name: 'GitHub API测试',
    method: 'GET',
    url: `${PROXY_BASE_URL}/.netlify/functions/proxy`,
    headers: { 
      'Content-Type': 'application/json',
      'x-request-line': 'GET https://api.github.com/users/octocat HTTP/1.1'
    },
    expectedStatus: 200
  }
];

// 执行HTTP请求
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.url);
    const client = url.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// 运行测试
async function runTests() {
  console.log('🚀 开始测试正向代理服务...\n');
  
  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    console.log(`📋 测试: ${testCase.name}`);
    console.log(`   URL: ${testCase.url}`);
    
    try {
      const response = await makeRequest(testCase);
      
      if (response.statusCode === testCase.expectedStatus) {
        console.log(`   ✅ 通过 - 状态码: ${response.statusCode}`);
        passed++;
      } else {
        console.log(`   ❌ 失败 - 期望状态码: ${testCase.expectedStatus}, 实际: ${response.statusCode}`);
        failed++;
      }
      
      // 显示响应摘要
      try {
        const jsonResponse = JSON.parse(response.body);
        if (jsonResponse.url) {
          console.log(`   📡 代理到: ${jsonResponse.url}`);
        }
      } catch (e) {
        // 非JSON响应，忽略
      }
      
    } catch (error) {
      console.log(`   ❌ 错误: ${error.message}`);
      failed++;
    }
    
    console.log('');
  }

  // 测试结果汇总
  console.log('📊 测试结果汇总:');
  console.log(`   ✅ 通过: ${passed}`);
  console.log(`   ❌ 失败: ${failed}`);
  console.log(`   📈 成功率: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 所有测试通过！正向代理服务运行正常。');
  } else {
    console.log('\n⚠️  部分测试失败，请检查代理服务配置。');
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  if (PROXY_BASE_URL === 'https://your-site.netlify.app') {
    console.log('⚠️  请先修改 PROXY_BASE_URL 为你的实际Netlify站点URL');
    console.log('   例如: https://my-proxy.netlify.app');
    process.exit(1);
  }
  
  runTests().catch(console.error);
}

module.exports = { runTests, makeRequest }; 