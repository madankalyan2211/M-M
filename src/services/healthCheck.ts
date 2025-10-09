export const checkApiHealth = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
    console.log('Checking API health at:', apiUrl);
    
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: `API is healthy: ${data.message}`
      };
    } else {
      return {
        success: false,
        message: `API health check failed with status ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('API health check error:', error);
    return {
      success: false,
      message: `Network error: ${error instanceof Error ? error.message : 'Failed to connect to API'}`
    };
  }
};