// Script to check multiple possible Render service URLs
const https = require('https');

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      resolve({
        url,
        status: res.statusCode,
        headers: res.headers
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        error: 'Timeout'
      });
    });
    
    req.end();
  });
}

async function checkRenderServices() {
  console.log('Checking possible Render service URLs...\n');
  
  // Common Render URL patterns based on service name
  const possibleUrls = [
    'https://m-m-healthcare-backend.onrender.com',
    'https://m-m-healthcare-backend.onrender.com/api/health',
    'https://m-m-healthcare-backend.onrender.com/health',
    'https://healthcare-app-design-4.onrender.com',
    'https://healthcare-backend.onrender.com',
    'https://medical-mate-backend.onrender.com'
  ];
  
  const results = [];
  
  for (const url of possibleUrls) {
    console.log(`Checking: ${url}`);
    try {
      const result = await checkUrl(url);
      results.push(result);
      
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
  
  console.log('Summary:');
  console.log('========');
  const workingUrls = results.filter(r => r.status === 200);
  if (workingUrls.length > 0) {
    console.log('Working URLs:');
    workingUrls.forEach(r => console.log(`  ✅ ${r.url}`));
  } else {
    console.log('❌ No working URLs found. The service may not be deployed.');
  }
}

checkRenderServices();