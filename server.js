/**
 * 简单的 HTTP 服务器
 * 用于提供 Yoya.Basic 演示界面
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// 自动打开浏览器
function openBrowser(url) {
  const platform = process.platform;
  const commands = {
    win32: () => spawn('start', [url], { shell: true }),
    darwin: () => spawn('open', [url]),
    linux: () => spawn('xdg-open', [url])
  };

  const cmd = commands[platform];
  if (cmd) {
    try {
      cmd();
      console.log('🚀 已自动打开浏览器');
    } catch (e) {
      console.log('ℹ️  无法自动打开浏览器，请手动访问');
    }
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // 处理根路径，重定向到入口导航页面
  if (req.url === '/' || req.url === '/index.html') {
    req.url = '/yoya.example.html';
  }

  // 构建文件路径
  let filePath;
  const urlParts = req.url.split('?')[0]; // 移除查询参数

  // 处理 /v2-examples/ 请求（打包后的演示页面和资源）
  // 所有 /v2-examples/xxx 请求都从 dist/v2-examples/xxx 提供
  if (urlParts.startsWith('/v2-examples/')) {
    filePath = path.join(__dirname, 'dist', urlParts);
  // 处理 /yoya/ 请求（从 src 目录提供）
  } else if (urlParts.includes('/yoya/')) {
    filePath = path.join(__dirname, 'src', urlParts);
  } else if (urlParts.startsWith('/v2/')) {
    filePath = path.join(__dirname, 'src', urlParts);
  } else if (urlParts.startsWith('/examples/')) {
    filePath = path.join(__dirname, 'src', urlParts);
  } else if (urlParts.startsWith('/dist/')) {
    filePath = path.join(__dirname, 'dist', urlParts);
  } else {
    // 默认从 examples 目录提供（不带前缀）
    filePath = path.join(__dirname, 'src', 'examples', urlParts);
  }

  // 获取文件扩展名
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // 读取并返回文件
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 - 文件未找到');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(`500 - 服务器错误：${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎨 Yoya.Basic 演示服务器已启动                          ║
║                                                           ║
║   访问地址：http://localhost:${PORT}/                           ║
║                                                           ║
║   按 Ctrl+C 停止服务器                                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);

  // 自动打开浏览器
  openBrowser(`http://localhost:${PORT}/`);
});
