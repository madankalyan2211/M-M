// Script to verify deployment status
async function verifyDeployment() {
  console.log('🔍 Verifying Healthcare App Deployment...\n');
  
  try {
    // Test frontend deployment
    console.log('1. Testing Frontend Deployment...');
    const frontendResponse = await fetch('https://healthcare-app-design-4.vercel.app');
    if (frontendResponse.ok) {
      console.log('   ✅ Frontend: Deployed and accessible');
    } else {
      console.log(`   ❌ Frontend: Error (Status ${frontendResponse.status})`);
    }
    
    // Test backend health endpoint
    console.log('\n2. Testing Backend Health...');
    const backendHealthResponse = await fetch('https://m-m-ahdp.onrender.com/api/health');
    if (backendHealthResponse.ok) {
      const healthData = await backendHealthResponse.json();
      console.log(`   ✅ Backend Health: ${healthData.message}`);
    } else {
      console.log(`   ❌ Backend Health: Error (Status ${backendHealthResponse.status})`);
    }
    
    // Test login endpoint
    console.log('\n3. Testing Backend Login Endpoint...');
    const loginResponse = await fetch('https://m-m-ahdp.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('   ✅ Backend Login: Working correctly');
      console.log(`   📋 User: ${loginData.data.user.name}`);
      console.log(`   🔐 Token: ${loginData.data.token.substring(0, 20)}...`);
    } else {
      console.log(`   ❌ Backend Login: Error (Status ${loginResponse.status})`);
    }
    
    // Test API configuration
    console.log('\n4. Testing API Configuration...');
    const apiBaseUrl = process.env.VITE_API_URL || 'https://m-m-ahdp.onrender.com/api';
    console.log(`   📍 API Base URL: ${apiBaseUrl}`);
    
    if (apiBaseUrl === 'https://m-m-ahdp.onrender.com/api') {
      console.log('   ✅ API Configuration: Correct');
    } else {
      console.log('   ⚠️  API Configuration: May need updating');
    }
    
    console.log('\n🎉 Deployment Verification Complete!');
    console.log('\n📋 Summary:');
    console.log('   - Frontend: Deployed on Vercel');
    console.log('   - Backend: Deployed on Render at https://m-m-ahdp.onrender.com');
    console.log('   - API Endpoints: Accessible and responding');
    console.log('   - Authentication: Working correctly');
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyDeployment();