// Test API connection with better error handling
async function testApiConnection() {
  console.log('Testing API connection...');
  
  const testUrls = [
    'https://m-m-healthcare-backend.onrender.com/api/health',
    'https://m-m-healthcare-backend.onrender.com/health',
    'http://localhost:10000/api/health'
  ];
  
  for (const url of testUrls) {
    console.log(`\nTesting: ${url}`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log(`  Status: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`  Data:`, data);
        console.log(`  ✅ Success`);
        return { success: true, url, data };
      } else {
        console.log(`  ❌ Failed with status ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log(`  ❌ Timeout - Server not responding`);
      } else {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
  }
  
  console.log('\n❌ All connection tests failed');
  return { success: false };
}

testApiConnection();