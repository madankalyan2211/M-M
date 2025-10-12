/// <reference types="vite/client" />

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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

    try {
      console.log(`Making API request to: ${this.baseUrl}${endpoint}`);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        mode: 'cors',
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
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
      return data;
    } catch (error) {
      console.error('API request error:', error);
      console.error('Request details:', {
        url: `${this.baseUrl}${endpoint}`,
        method: options.method || 'GET',
        headers
      });
      
      return {
        success: false,
        message: `Network error: ${error instanceof Error ? error.message : 'Please check your connection and try again.'}`,
      };
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
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
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  logout() {
    this.clearToken();
  }
}

export const api = new ApiService();