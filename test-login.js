const axios = require('axios');

async function testLogin() {
  try {
    const response = await axios.post('https://m-m-ahdp.onrender.com/api/auth/login', {
      email: 'test@example.com',
      password: 'testpassword123'
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful:', response.data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    console.error('Error config:', error.config);
  }
}

testLogin();
