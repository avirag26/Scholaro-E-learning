import axios from 'axios';

const BASE_URL = 'http://localhost:5000'; // Your backend URL

// Public Axios instance (for login, register, etc.)
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Private Axios instance (for authenticated requests)
export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Important for sending cookies
});
