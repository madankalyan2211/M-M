// Script to check deployment status
const https = require('https');

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      resolve({
        status: res.statusCode,
        headers: res.headers
      });
    });
    
    req.on('error', (error) => {
      resolve({
        error: error.message
      });
    });
    
    req.end();
  });
}

async function checkDeployment() {
  console.log('Checking deployment status...\n');
  
  const urls = [
    'https://m-m-healthcare-backend.onrender.com',
    'https://m-m-healthcare-backend.onrender.com/api/health',
    'https://m-m-healthcare-backend.onrender.com/api/auth/health',
    'https://healthcare-app-design-4.vercel.app'
  ];
  
  for (const url of urls) {
    console.log(`Checking: ${url}`);
    try {
      const result = await checkUrl(url);
      if (result.error) {
        console.log(`  ❌ Error: ${result.error}`);
      } else {
        console.log(`  Status: ${result.status}`);
        if (result.status === 200) {
          console.log(`  ✅ OK`);
        } else {
          console.log(`  ⚠️  Not OK`);
        }
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    console.log('');
  }
  
  console.log('Checking environment variables...');
  console.log('VITE_API_URL:', process.env.VITE_API_URL || 'Not set');
  console.log('Expected API URL: https://m-m-healthcare-backend.onrender.com/api');
}

checkDeployment();