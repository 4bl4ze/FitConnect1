import { api } from "@/utils/api";

export type Credentials = { email: string; password: string };

export async function login(credentials: Credentials) {
  const res = await api.post("/auth/login", credentials);
  return res.data;
}

export async function demoLogin() {
  const res = await api.post("/auth/demo-login");
  return res.data;
}

export async function refreshToken(refreshToken: string) {
  const res = await api.post("/auth/refresh", { refreshToken });
  return res.data;
}
