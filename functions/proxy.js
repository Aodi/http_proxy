const https = require('https');
const http = require('http');
const { URL } = require('url');

exports.handler = async (event, context) => {
  try {
    // 获取请求信息
    const { httpMethod, path, queryStringParameters, headers, body, isBase64Encoded } = event;
    
    let targetUrl = null;
    let targetMethod = httpMethod;
    
    // 标准HTTP代理格式处理
    // 方法1: 从请求头中获取完整的URL（标准HTTP代理格式）
    const requestLine = headers['x-request-line'] || headers['x-forwarded-request-line'];
    if (requestLine) {
      const parts = requestLine.split(' ');
      if (parts.length >= 2 && (parts[1].startsWith('http://') || parts[1].startsWith('https://'))) {
        targetMethod = parts[0];
        targetUrl = parts[1];
      }
    }
    
    // 方法2: 从Host头和其他信息构建URL（用于标准HTTP代理）
    if (!targetUrl && headers.host) {
      const protocol = headers['x-forwarded-proto'] || 'https';
      const path = event.path || '/';
      targetUrl = `${protocol}://${headers.host}${path}`;
    }
    
    // 如果没有提供目标URL，返回错误信息
    if (!targetUrl) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH, CONNECT'
        },
        body: JSON.stringify({
          error: '缺少目标URL',
          usage: [
            '标准HTTP代理: curl -x https://your-site.netlify.app https://api.github.com/users/octocat',
            '环境变量: export https_proxy="https://your-site.netlify.app"',
            '自定义请求头: curl -H "x-request-line: GET https://httpbin.org/get HTTP/1.1" https://your-site.netlify.app'
          ],
          debug: {
            path: event.path,
            headers: Object.keys(headers),
            method: httpMethod
          }
        })
      };
    }

    // 确保URL有协议
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    // 解析目标URL
    const url = new URL(targetUrl);
    
    // 准备请求选项
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: targetMethod,
      headers: {}
    };

    // 复制请求头（排除代理相关的头）
    const excludeHeaders = [
      'host', 'content-length', 'connection', 'user-agent', 
      'origin', 'referer', 'x-request-line', 'x-forwarded-request-line',
      'x-forwarded-proto', 'x-forwarded-host', 'x-forwarded-for'
    ];
    
    for (const [key, value] of Object.entries(headers)) {
      if (!excludeHeaders.includes(key.toLowerCase())) {
        options.headers[key] = value;
      }
    }

    // 设置User-Agent
    options.headers['User-Agent'] = 'Netlify-HTTP-Proxy/1.0';

    // 处理请求体
    let requestBody = null;
    if (body && ['POST', 'PUT', 'PATCH'].includes(targetMethod)) {
      requestBody = isBase64Encoded ? Buffer.from(body, 'base64') : body;
      if (requestBody) {
        options.headers['Content-Length'] = Buffer.byteLength(requestBody);
      }
    }

    // 创建代理请求
    return new Promise((resolve, reject) => {
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let responseBody = '';
        
        res.on('data', (chunk) => {
          responseBody += chunk;
        });
        
        res.on('end', () => {
          // 准备响应头
          const responseHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH, CONNECT',
            'Access-Control-Max-Age': '86400'
          };
          
          // 复制响应头
          for (const [key, value] of Object.entries(res.headers)) {
            if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
              responseHeaders[key] = value;
            }
          }
          
          resolve({
            statusCode: res.statusCode,
            headers: responseHeaders,
            body: responseBody,
            isBase64Encoded: false
          });
        });
      });

      req.on('error', (error) => {
        console.error('代理请求错误:', error);
        resolve({
          statusCode: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            error: '代理请求失败',
            message: error.message
          })
        });
      });

      // 设置请求超时
      req.setTimeout(30000, () => {
        req.destroy();
        resolve({
          statusCode: 504,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            error: '请求超时',
            message: '目标服务器响应超时'
          })
        });
      });

      // 发送请求体
      if (requestBody) {
        req.write(requestBody);
      }
      
      req.end();
    });

  } catch (error) {
    console.error('代理函数错误:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: '内部服务器错误',
        message: error.message
      })
    };
  }
}; 