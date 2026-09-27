import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 45000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mosje_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (phone_number, pin) => {
  const response = await apiClient.post('/auth/login', { phone_number, pin });
  return response.data;
};

export const register = async (phone_number, pin, name) => {
  const response = await apiClient.post('/auth/register', { phone_number, pin, name });
  return response.data;
};

export const submitApplication = async (payload) => {
  const response = await apiClient.post('/applications/submit', payload);
  return response.data;
};

export const fetchMyApplications = async () => {
  const response = await apiClient.get('/applications/me');
  return response.data;
};

export const extractDocument = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/extract-document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const mockExtractDocument = async () => {
  const response = await apiClient.post('/mock/extract-document');
  return response.data;
};

export const evaluateScheme = async (profile) => {
  const response = await apiClient.post('/evaluate-scheme', profile);
  return response.data;
};

export const calculateEMI = async (emiPayload) => {
  const response = await apiClient.post('/calculate-emi', emiPayload);
  return response.data;
};

export const routeBranch = async (routePayload) => {
  const response = await apiClient.post('/branches/route', routePayload);
  return response.data;
};

export const fetchAdminBranches = async () => {
  const response = await apiClient.get('/admin/branches');
  return response.data;
};

export const sendChatMessage = async ({ message, language, history, app_state, user_context, generate_audio }) => {
  const response = await apiClient.post('/chat', {
    message,
    language,
    history,
    app_state: app_state || user_context || {},
    user_context: user_context || app_state || {},
    generate_audio: generate_audio || false,
  });
  return response.data;
};

export const fetchAllApplications = async () => {
  const response = await apiClient.get('/applications/all');
  return response.data;
};

export const updateApplicationStatus = async (arn, status) => {
  const response = await apiClient.patch(`/applications/${arn}/status`, { status });
  return response.data;
};

export const fetchAllSchemes = async () => {
  const response = await apiClient.get('/schemes');
  return response.data;
};

export const fetchTTS = async (text, language = 'en') => {
  const response = await apiClient.post('/tts', { text, language });
  return response.data.audio_base64;
};

export const deleteApplication = async (arn) => {
  const response = await apiClient.delete('/applications/' + arn);
  return response.data;
};
