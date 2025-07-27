const https = require('https');

exports.handler = async (event) => {
  try {
    // 1. 获取 path 和 query
    const path = event.path || '/';
    let query = '';
    if (event.queryStringParameters && Object.keys(event.queryStringParameters).length > 0) {
      query = '?' + Object.entries(event.queryStringParameters)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        .join('&');
    }
    const targetUrl = `https://api.themoviedb.org${path}${query}`;

    // 2. 复制 headers，移除/重写部分头部
    const headers = { ...event.headers };
    delete headers['host'];
    delete headers['connection'];
    delete headers['content-length'];
    headers['host'] = 'api.themoviedb.org';

    // 3. 处理请求体
    let requestBody = null;
    if (event.body && ['POST', 'PUT', 'PATCH'].includes(event.httpMethod)) {
      requestBody = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64')
        : event.body;
    }

    // 4. 发起代理请求
    return await new Promise((resolve) => {
      const req = https.request(targetUrl, {
        method: event.httpMethod,
        headers,
      }, (res) => {
        let responseBody = [];
        res.on('data', (chunk) => responseBody.push(chunk));
        res.on('end', () => {
          const bodyBuffer = Buffer.concat(responseBody);
          const responseHeaders = { ...res.headers };
          responseHeaders['access-control-allow-origin'] = '*';
          responseHeaders['access-control-allow-headers'] = '*';
          responseHeaders['access-control-allow-methods'] = '*';
          resolve({
            statusCode: res.statusCode,
            headers: responseHeaders,
            body: bodyBuffer.toString('base64'),
            isBase64Encoded: true,
          });
        });
      });
      req.on('error', (err) => {
        console.error('Proxy error:', err);
        resolve({
          statusCode: 502,
          body: JSON.stringify({ error: 'Proxy error', message: err.message }),
          headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
        });
      });
      if (requestBody) req.write(requestBody);
      req.end();
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal error', message: error.message }),
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
    };
  }
}; 