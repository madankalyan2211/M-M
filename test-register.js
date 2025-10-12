const axios = require('axios');

async function testRegister() {
  try {
    const response = await axios.post('https://m-m-ahdp.onrender.com/api/auth/register', {
      name: 'Test User',
      email: `testuser_${Date.now()}@example.com`,
      password: 'Test@1234',
      confirmPassword: 'Test@1234'
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Registration successful:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    console.error('Error config:', error.config);
  }
}

testRegister();
