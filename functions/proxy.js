const https = require('https');

exports.handler = async (event) => {
  try {
    // 1. 组装目标URL
    const path = event.rawUrl
      ? new URL(event.rawUrl).pathname + (new URL(event.rawUrl).search || '')
      : event.path;
    const targetUrl = `https://api.themoviedb.org${path}`;

    // 2. 组装请求选项
    const options = {
      method: event.httpMethod,
      headers: { ...event.headers },
    };
    // 移除host头，防止冲突
    delete options.headers.host;

    // 3. 处理请求体
    let requestBody = null;
    if (event.body && ['POST', 'PUT', 'PATCH'].includes(event.httpMethod)) {
      requestBody = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64')
        : event.body;
      options.headers['Content-Length'] = Buffer.byteLength(requestBody);
    }

    // 4. 发起代理请求
    return await new Promise((resolve) => {
      const req = https.request(targetUrl, options, (res) => {
        let responseBody = [];
        res.on('data', (chunk) => responseBody.push(chunk));
        res.on('end', () => {
          const bodyBuffer = Buffer.concat(responseBody);
          // 组装响应头
          const responseHeaders = { ...res.headers };
          // CORS支持
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
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal error', message: error.message }),
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
    };
  }
}; 