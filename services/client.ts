
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';



const TEAMMATE_IP = '10.218.52.196';
const PORT = '8080';

// const PORT = '8080';
const BASE_URL = `http://${TEAMMATE_IP}:${PORT}/api`;



export const TOKEN_KEY = 'auth_token';

const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach the JWT to every outgoing request
API.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
