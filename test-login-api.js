// Test script to check login API connectivity
const API_URL = process.env.VITE_API_URL || 'https://m-m-healthcare-backend.onrender.com/api';

async function testLoginAPI() {
  console.log('Testing login API connectivity...');
  console.log('API URL:', API_URL);
  
  try {
    // Test health endpoint first
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    console.log('Health status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('Health data:', healthData);
    
    // Test auth health endpoint
    console.log('\n2. Testing auth health endpoint...');
    const authHealthResponse = await fetch(`${API_URL}/auth/health`);
    console.log('Auth health status:', authHealthResponse.status);
    const authHealthData = await authHealthResponse.json();
    console.log('Auth health data:', authHealthData);
    
    // Test CORS
    console.log('\n3. Testing CORS...');
    const corsResponse = await fetch(`${API_URL}/auth/cors-test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('CORS test status:', corsResponse.status);
    const corsData = await corsResponse.json();
    console.log('CORS test data:', corsData);
    
    console.log('\n✅ All API tests completed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
  }
}

testLoginAPI();