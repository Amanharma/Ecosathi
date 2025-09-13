// src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Create an empty headers object to start
    const config = {
      headers: {},
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ IMPORTANT: If the request body is FormData (for file uploads), 
    // we must not set the 'Content-Type' header. The browser will set it automatically.
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Handle cases where the response body is empty (e.g., DELETE)
      const text = await response.text();
      return text ? JSON.parse(text) : {};

    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint);
  }

  // POST request
  async post(endpoint, data) {
    // Check if the data is a FormData object (for file uploads)
    if (data instanceof FormData) {
      return this.request(endpoint, {
        method: 'POST',
        body: data, // Send the FormData object directly
      });
    }

    // Default to JSON for all other requests
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();

// Specific API functions
export const testConnection = () => apiService.get('/api/test');
export const loginUser = (credentials) => apiService.post('/api/auth/login', credentials);
export const registerUser = (userData) => apiService.post('/api/auth/register', userData);