import axios from 'axios';
import secureLocalStorage from "react-secure-storage";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL, // Base URL from environment
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the Authorization header
api.interceptors.request.use(
  (config) => {
    // Retrieve token from storage or context
    const accessToken = secureLocalStorage.getItem('accessToken'); // Adjust based on where you store the token

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // Handle errors before the request is sent
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional)
api.interceptors.response.use(
  (response) => response, // Pass successful responses directly
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      console.error('Unauthorized! Redirecting to login...');
      // Optional: Redirect to login or perform logout
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
