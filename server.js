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
  const p = path.join(root, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!p.startsWith(root) || !fs.existsSync(p)) { res.writeHead(404); res.end('404 Not Found'); return; }
  res.writeHead(200, { 'Content-Type': p.endsWith('.html') ? 'text/html; charset=utf-8' : 'text/plain' });
  res.end(fs.readFileSync(p));
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
