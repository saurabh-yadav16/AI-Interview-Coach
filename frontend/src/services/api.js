import axios from 'axios';

// Dynamically resolve Backend API Base URL from VITE_API_BASE_URL or auto-detect deployment environment
let rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawBaseUrl || rawBaseUrl.trim() === '') {
  // If running in browser on a deployed production domain (like Vercel *.vercel.app)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    rawBaseUrl = 'https://ai-interview-coach-backend.onrender.com/api';
  } else {
    rawBaseUrl = 'http://localhost:5000/api';
  }
}

rawBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');
if (!rawBaseUrl.endsWith('/api')) {
  rawBaseUrl += '/api';
}

const API = axios.create({
  baseURL: rawBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT Auth token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('interview_coach_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for response error handling & automatic expired token redirect
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('interview_coach_token');
      localStorage.removeItem('interview_coach_user');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    let message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    
    if (error.response?.status === 404) {
      message = 'Backend API Server not reachable (404). Please ensure VITE_API_BASE_URL is set in Vercel Environment Variables and Render backend service is running.';
    }
    return Promise.reject(new Error(message));
  }
);

// Authentication Endpoints
export const registerApi = (userData) => API.post('/auth/register', userData);
export const loginApi = (credentials) => API.post('/auth/login', credentials);
export const forgotPasswordApi = (emailData) => API.post('/auth/forgot-password', emailData);
export const resetPasswordApi = (resetData) => API.post('/auth/reset-password', resetData);
export const getMeApi = () => API.get('/auth/me');
export const updateProfileApi = (profileData) => API.put('/auth/profile', profileData);

// Resume Upload & Analysis Endpoints
export const uploadResumeApi = (formData) =>
  API.post('/resumes/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const analyzeResumeApi = (id, targetRole) => API.post(`/resumes/${id}/analyze`, { targetRole });
export const getResumesApi = () => API.get('/resumes');
export const getResumeByIdApi = (id) => API.get(`/resumes/${id}`);
export const deleteResumeApi = (id) => API.delete(`/resumes/${id}`);

// Interview Session Endpoints
export const startInterviewApi = (configData) => API.post('/interviews/start', configData);
export const submitAnswerApi = (id, answerData) => API.post(`/interviews/${id}/answer`, answerData);
export const getNextQuestionApi = (id) => API.post(`/interviews/${id}/next-question`);
export const evaluateInterviewApi = (id) => API.post(`/interviews/${id}/evaluate`);
export const getInterviewByIdApi = (id) => API.get(`/interviews/${id}`);
export const getInterviewHistoryApi = () => API.get('/interviews/history');

// Analytics Endpoints
export const getAnalyticsOverviewApi = () => API.get('/analytics/overview');

// 7-Day Improvement Plan Endpoints
export const getImprovementPlanApi = () => API.get('/improvement-plan');
export const toggleImprovementTaskApi = (payload) => API.put('/improvement-plan/toggle-task', payload);

// AI Tutor Endpoints
export const askTutorApi = (promptData) => API.post('/tutor/ask', promptData);
export const getTutorSuggestionsApi = () => API.get('/tutor/suggestions');

export default API;
