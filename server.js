import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function serveFile(filePath, contentType, res) {
    try {
        const data = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
    }
}

const server = http.createServer(async (req, res) => {
    const { url, method } = req; 
    console.log(`${method} ${url}`);

    // 1. GET / - Home page
    if (url === '/' && method === 'GET') {
        await serveFile(path.join(__dirname, 'public', 'index.html'), 'text/html', res);
    } 
    // 2. GET /about - About page
    else if (url === '/about' && method === 'GET') {
        await serveFile(path.join(__dirname, 'public', 'about.html'), 'text/html', res);
    } 
    // 3. GET /projects - Projects page
    else if (url === '/projects' && method === 'GET') {
        await serveFile(path.join(__dirname, 'public', 'projects.html'), 'text/html', res);
    } 
    // 4. GET /contact - Contact page
    else if (url === '/contact' && method === 'GET') {
        await serveFile(path.join(__dirname, 'public', 'contact.html'), 'text/html', res);
    } 
    // 5. GET /api/data - JSON response
    else if (url === '/api/data' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Hello!', time: new Date().toISOString() }));
    } 
    // 6. POST /api/contact - Accept form data
    else if (url === '/api/contact' && method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                console.log('Received:', data);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Data received!' }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } 
    // 7. Serve CSS file
    else if (url === '/style.css') {
        await serveFile(path.join(__dirname, 'public', 'style.css'), 'text/css', res);
    } 
    // 8. Serve at least one image
    else if (url.startsWith('/images/')) {
        const ext = path.extname(url).toLowerCase();
        const mimeTypes = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif' };
        await serveFile(path.join(__dirname, 'public', url), mimeTypes[ext] || 'application/octet-stream', res);
    } 
    // 9. 404 for unknown routes
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Not Found</h1>');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});