import API, { deleteToken, getToken, saveToken, TOKEN_KEY } from "./client";

export interface AuthRequest {
  email: string;
  password: string;
  fullName?: string;
  name?: string;
}

export type RegisterRequest = AuthRequest;
export type LoginRequest = AuthRequest;

export interface AuthResponse {
  token: string;
  message?: string;
}

export { deleteToken, getToken, saveToken, TOKEN_KEY };

export const registerUser = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  const payload = {
    email: data.email,
    password: data.password,
    ...(data.fullName ? { fullName: data.fullName } : {}),
    ...(data.name ? { name: data.name } : {}),
    ...(data.fullName && !data.name ? { name: data.fullName } : {}),
  };

  const response = await API.post<any>("/auth/register", payload);
  if (typeof response.data === "string") {
    return { token: "", message: response.data };
  }
  if (response.data?.token) {
    await saveToken(response.data.token);
  }
  return response.data;
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>("/auth/login", data);
  if (response.data?.token) {
    await saveToken(response.data.token);
  }
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await deleteToken();
};

export const requestPasswordReset = async (email: string): Promise<any> => {
  const response = await API.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (data: {
  token: string;
  newPassword: string;
}): Promise<any> => {
  const response = await API.post("/auth/resetPassword", data);
  return response.data;
};
