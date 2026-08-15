// 深宫华容道本地服务器
// 用法：node server.js          （启动并自动打开浏览器）
//       node server.js --no-open（只启动服务，不打开浏览器）
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { exec } = require('child_process');
const root = __dirname;
const PORT = 8123;
const URL = 'http://localhost:' + PORT + '/';

http.createServer((req, res) => {
  try {
    let p = path.join(root, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    // 目录或不存在的路径一律回退到 index.html（SPA 行为）
    if (!p.startsWith(root) || !fs.existsSync(p) || !fs.statSync(p).isFile()) p = path.join(root, 'index.html');
    const ext = path.extname(p).toLowerCase();
    const type = ext === '.html' ? 'text/html; charset=utf-8'
      : ext === '.webmanifest' ? 'application/manifest+json; charset=utf-8'
      : ext === '.js' ? 'text/javascript; charset=utf-8'
      : ext === '.json' ? 'application/json; charset=utf-8'
      : ext === '.png' ? 'image/png'
      : ext === '.txt' ? 'text/plain; charset=utf-8'
      : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    res.end(fs.readFileSync(p));
  } catch (e) {
    res.writeHead(500); res.end('500 Internal Error');
  }
}).listen(PORT, () => {
  console.log('ZhenHuan HuaRongDao: ' + URL);
  console.log('Press Ctrl+C to stop.');
  if (!process.argv.includes('--no-open')) {
    const open = process.platform === 'win32' ? 'start "" "' + URL + '"'
      : process.platform === 'darwin' ? 'open "' + URL + '"'
      : 'xdg-open "' + URL + '"';
    setTimeout(() => exec(open, () => {}), 500);
  }
});
