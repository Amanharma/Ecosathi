// Simple connection test
const http = require('http');

console.log('Testing backend connection...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Backend status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Backend response:', data);
    console.log('✅ Backend is running and responding!');
  });
});

req.on('error', (err) => {
  console.error('❌ Backend connection failed:', err.message);
  console.log('Make sure the backend is running on port 5000');
});

req.end();
