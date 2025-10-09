/// <reference types="vite/client" />

// Use a more flexible approach for API URL with fallback
const getApiBaseUrl = () => {
  // Check for VITE_API_URL environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in development
  if (import.meta.env.DEV) {
    return 'http://localhost:10000';
  }
  
  // Production fallback
  return 'https://m-m-ahdp.onrender.com';
};

const API_BASE_URL = getApiBaseUrl();

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
  requiresVerification?: boolean;
  email?: string;
}

interface AuthResponse {
  token: string;
  user?: any;
}

class ApiService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
    console.log('API Service initialized with base URL:', this.baseUrl);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Add credentials for CORS
    const fetchOptions: RequestInit = {
      ...options,
      headers,
      credentials: 'include',
    };

    try {
      console.log(`Making API request to: ${this.baseUrl}${endpoint}`);
      console.log('Request options:', fetchOptions);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, fetchOptions);

      console.log(`Response status: ${response.status}`);
      console.log('Response headers:', [...response.headers.entries()]);

      // Handle network errors
      if (!response.ok) {
        // Special handling for network errors
        if (response.status === 0) {
          return {
            success: false,
            message: 'Network error: Unable to connect to the server. Please check your internet connection and try again.'
          };
        }
        
        // Handle 404 errors specifically
        if (response.status === 404) {
          return {
            success: false,
            message: 'Service not found. The backend service may be temporarily unavailable. Please try again later.'
          };
        }
        
        let errorData;
        try {
          errorData = await response.json();
          console.log('Error response data:', errorData);
        } catch (parseError) {
          console.log('Failed to parse error response as JSON');
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        
        return {
          success: false,
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          errors: errorData.errors,
          requiresVerification: errorData.requiresVerification,
          email: errorData.email,
        };
      }

      const data = await response.json();
      console.log('Successful response data:', data);
      return data;
    } catch (error) {
      console.error('API request error:', error);
      console.error('Request details:', {
        url: `${this.baseUrl}${endpoint}`,
        method: options.method || 'GET',
        headers
      });
      
      // More specific error handling
      if (error instanceof TypeError) {
        if (error.message.includes('fetch')) {
          return {
            success: false,
            message: 'Network error: Unable to connect to the server. Please check your internet connection and ensure the backend service is running.'
          };
        }
        if (error.message.includes('Failed to fetch')) {
          return {
            success: false,
            message: 'Network error: Failed to fetch. Please check your internet connection and try again.'
          };
        }
      }
      
      return {
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Please check your connection and try again.'}`,
      };
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
    console.log('Auth token set');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
    console.log('Auth token cleared');
  }

  // Auth endpoints
  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyOTP(data: { email: string; otp: string }) {
    return this.request<AuthResponse>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resendOTP(email: string) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  async updateProfile(data: any) {
    console.log('Updating profile with data:', data);
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  logout() {
    this.clearToken();
  }

  // Test API connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: `Connected to API: ${data.message}`
        };
      } else {
        return {
          success: false,
          message: `API connection failed with status ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      console.error('API connection test error:', error);
      return {
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Failed to connect to API'}`
      };
    }
  }
}

export const api = new ApiService();