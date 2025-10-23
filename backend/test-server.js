// Simple test server to verify port 5000 works
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', message: 'Test server working!' }));
});

server.listen(5000, '0.0.0.0', () => {
  console.log('Test server running on http://localhost:5000');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
