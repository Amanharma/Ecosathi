// src/utils/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // ✅ Updated to port 5000

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

    // ✅ Updated to use the correct token key
    const token = localStorage.getItem("ecosathi_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ IMPORTANT: If the request body is FormData (for file uploads),
    // we must not set the 'Content-Type' header. The browser will set it automatically.
    if (!(options.body instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // ✅ Better error handling with response body
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage =
            errorJson.msg ||
            errorJson.message ||
            `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = errorText || `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      // Handle cases where the response body is empty (e.g., DELETE)
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error("API request failed:", error);
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
        method: "POST",
        body: data, // Send the FormData object directly
      });
    }

    // Default to JSON for all other requests
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiService = new ApiService();

// ✅ Updated API functions to match your backend endpoints
export const testConnection = () => apiService.get("/"); // Your backend health check
export const loginUser = (credentials) =>
  apiService.post("/api/auth/login", credentials);
export const registerUser = (userData) =>
  apiService.post("/api/auth/register", userData);

// ✅ Added complaint-related API functions that AuthContext needs
export const createComplaint = (complaintData) =>
  apiService.post("/api/complaints", complaintData);
export const getMyComplaints = (filters = {}) => {
  const params = new URLSearchParams(filters);
  const endpoint = params.toString()
    ? `/api/complaints/my?${params}`
    : "/api/complaints/my";
  return apiService.get(endpoint);
};
export const getAllComplaints = (filters = {}) => {
  const params = new URLSearchParams(filters);
  const endpoint = params.toString()
    ? `/api/complaints/all?${params}`
    : "/api/complaints/all";
  return apiService.get(endpoint);
};
export const getAdminAssignments = () =>
  apiService.get("/api/complaints/admin-assignments");
