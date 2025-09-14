// Test both servers
const http = require('http');

console.log('🔍 Testing servers...\n');

// Test Backend
console.log('Testing Backend (port 5000)...');
const backendReq = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(`✅ Backend: ${res.statusCode} - ${data.trim()}`);
    
    // Test Frontend
    console.log('\nTesting Frontend (port 5173)...');
    const frontendReq = http.request({
      hostname: 'localhost',
      port: 5173,
      path: '/',
      method: 'GET'
    }, (res) => {
      console.log(`✅ Frontend: ${res.statusCode} - Server responding`);
      console.log('\n🎉 Both servers are running!');
      console.log('📱 Open your browser and go to: http://localhost:5173');
    });
    
    frontendReq.on('error', (err) => {
      console.log(`❌ Frontend Error: ${err.message}`);
      console.log('💡 Try: http://localhost:5174 (alternative port)');
    });
    
    frontendReq.end();
  });
});

backendReq.on('error', (err) => {
  console.log(`❌ Backend Error: ${err.message}`);
  console.log('💡 Make sure backend is running: cd backend && npm run dev');
});

backendReq.end();
