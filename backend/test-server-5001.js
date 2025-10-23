// Test server on port 5001
const http = require('http');

const server = http.createServer((req, res) => {
  console.log('Got request:', req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', message: 'Test server on 5001 working!' }));
});

server.listen(5001, '127.0.0.1', (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
  console.log('Test server running on http://localhost:5001');
  console.log('Server address:', server.address());
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep process alive
setInterval(() => {
  console.log('Server still running...', new Date().toISOString());
}, 5000);
