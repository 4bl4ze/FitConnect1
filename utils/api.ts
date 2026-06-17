import axios from "axios";
import Constants from "expo-constants";

const getBaseUrl = () => {
  try {
    // @ts-ignore
    const extra = Constants.manifest?.extra;
    return (
      (extra && extra.API_URL) || process.env.API_URL || "http://localhost:8080"
    );
  } catch (e) {
    return process.env.API_URL || "http://localhost:8080";
  }
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
});

export default api;
