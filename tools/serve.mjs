#!/usr/bin/env node
/**
 * tools/serve.mjs — Fast, concurrent HTTP/1.1 static server for Basements & Basilisks.
 * Replaces single-threaded python3 http.server so 30+ hero portraits stream in parallel
 * with Cache-Control + ETag 304 support and never stall or crash on canceled sockets.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT || process.argv[2] || 8081);
const host = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8'
};

process.on('uncaughtException', err => console.error('[serve] uncaught:', err.message));

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
    const abs = path.resolve(root, rel);
    if (!abs.startsWith(root)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    fs.stat(abs, (err, st) => {
      if (err || !st.isFile()) {
        res.writeHead(404); res.end('Not found'); return;
      }
      const ext = path.extname(abs).toLowerCase();
      const etag = `"${st.size}-${Math.floor(st.mtimeMs)}"`;
      const isImg = ext === '.png' || ext === '.webp' || ext === '.jpg' || ext === '.jpeg' || ext === '.svg';
      const cache = isImg ? 'public, max-age=3600' : 'no-cache';
      if (req.headers['if-none-match'] === etag) {
        res.writeHead(304, { ETag: etag, 'Cache-Control': cache });
        res.end();
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Content-Length': st.size,
        'Cache-Control': cache,
        ETag: etag
      });
      if (req.method === 'HEAD') { res.end(); return; }
      const stream = fs.createReadStream(abs);
      stream.on('error', () => { if (!res.headersSent) res.writeHead(500); res.end(); });
      stream.pipe(res);
    });
  } catch (e) {
    res.writeHead(500); res.end('Server error');
  }
});

server.keepAliveTimeout = 65000;
server.listen(port, host, () => {
  console.log(`Basements & Basilisks server running at http://${host}:${port}/`);
});
