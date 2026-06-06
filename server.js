const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

/**
 * MIME type mapping for common file extensions
 */
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/**
 * Security headers for better protection
 */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'geolocation=(), microphone=(), camera=(), payment=()',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
};

/**
 * Create HTTP server with request handling
 */
const server = http.createServer((req, res) => {
  // Resolve file path safely
  let filePath = path.join(
    __dirname,
    req.url === '/' ? 'index.html' : req.url
  );

  // Security: Prevent directory traversal attacks
  const resolvedPath = path.resolve(filePath);
  const baseDir = path.resolve(__dirname);

  if (!resolvedPath.startsWith(baseDir)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Forbidden</h1>');
    console.warn(`[SECURITY] Directory traversal attempt: ${req.url}`);
    return;
  }

  // Get file extension
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Read and serve file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
        console.warn(`[404] Not found: ${req.url}`);
      } else if (err.code === 'EISDIR') {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        res.end('<h1>403 - Forbidden</h1>');
        console.warn(`[403] Directory access attempt: ${req.url}`);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Internal Server Error</h1>');
        console.error(`[ERROR] Server error: ${err.message}`);
      }
      return;
    }

    // Set response headers
    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': data.length,
      ...SECURITY_HEADERS,
    });

    res.end(data);
  });
});

/**
 * Handle server errors
 */
server.on('error', (err) => {
  console.error(`[ERROR] Server error: ${err.message}`);
  process.exit(1);
});

/**
 * Start server
 */
server.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}`);
  console.log(`📱 Local access: http://localhost:${PORT}`);
  console.log(`🌐 Network access: http://<your-ip>:${PORT}`);
  console.log(`🛑 Press Ctrl+C to stop server\n`);
});
