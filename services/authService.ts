// // // import API from "./client";

// // // // Matches AuthRequest.java
// // // export interface AuthRequest {
// // //   email?: string;
// // //   password?: string;
// // //   fullName?: string; // Used during registration
// // // }

// // // // Matches AuthResponse.java
// // // export interface AuthResponse {
// // //   token: string;
// // // }

// // // // 1. REGISTER USER -> @PostMapping("/auth/register")
// // // export const registerUser = async (data: AuthRequest): Promise<AuthResponse> => {
// // //   const response = await API.post<AuthResponse>("/auth/register", data);
// // //   return response.data;
// // // };

// // // // 2. LOGIN USER -> @PostMapping("/auth/login")
// // // export const loginUser = async (data: AuthRequest): Promise<AuthResponse> => {
// // //   const response = await API.post<AuthResponse>("/auth/login", data);
// // //   return response.data;
// // // };



// // import API, { TOKEN_KEY } from "./client";
// // import * as SecureStore from 'expo-secure-store';

// // export interface AuthRequest {
// //   email?: string;
// //   password?: string;
// //   fullName?: string;
// // }

// // export interface AuthResponse {
// //   token: string;
// // }

// // // Register does NOT log the user in — email must be verified first, so it returns a message, not a token
// // export const registerUser = async (data: AuthRequest): Promise<string> => {
// //   const response = await API.post<string>("/auth/register", data, {
// //   responseType: 'text',
// // });
// // return response.data;
// // };

// // export const loginUser = async (data: AuthRequest): Promise<AuthResponse> => {
// //   const response = await API.post<AuthResponse>("/auth/login", data);
// //   await SecureStore.setItemAsync(TOKEN_KEY, response.data.token);
// //   return response.data;
// // };

// // export const logoutUser = async (): Promise<void> => {
// //   await SecureStore.deleteItemAsync(TOKEN_KEY);
// // };












// import { Platform } from "react-native";
// import API, { TOKEN_KEY } from "./client";
// import * as SecureStore from "expo-secure-store";

// // Specific payload types for stronger TypeScript safety
// export interface RegisterRequest {
//   fullName: string;
//   email: string;
//   password: string;
// }

// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// export interface AuthResponse {
//   token: string;
// }

// // Cross-platform SecureStore wrapper (Prevents crashes on Web)
// const saveToken = async (token: string) => {
//   if (Platform.OS === "web") {
//     localStorage.setItem(TOKEN_KEY, token);
//   } else {
//     await SecureStore.setItemAsync(TOKEN_KEY, token);
//   }
// };

// const deleteToken = async () => {
//   if (Platform.OS === "web") {
//     localStorage.removeItem(TOKEN_KEY);
//   } else {
//     await SecureStore.deleteItemAsync(TOKEN_KEY);
//   }
// };

// // 1. REGISTER USER -> Returns success text (e.g. "Please check your email to verify")
// export const registerUser = async (data: RegisterRequest): Promise<string> => {
//   const response = await API.post<string>("/auth/register", data, {
//     responseType: "text",
//   });
//   return response.data;
// };

// // 2. LOGIN USER -> Saves JWT token & returns response
// export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
//   const response = await API.post<AuthResponse>("/auth/login", data);
//   if (response.data?.token) {
//     await saveToken(response.data.token);
//   }
//   return response.data;
// };

// // 3. LOGOUT USER -> Clears saved token
// export const logoutUser = async (): Promise<void> => {
//   await deleteToken();
// };

// // In services/authService.ts
// export const requestPasswordReset = async (email: string) => {
//   const response = await API.post("/auth/forgot-password", { email });
//   return response.data;
// };

// export const resendVerificationCode = async (email: string): Promise<string> => {
//   const response = await API.post<string>("/auth/resend-verification", { email }, {
//     responseType: "text",
//   });
//   return response.data;
// };

// // 2. Verify token submitted by user
// export const verifyEmailToken = async (email: string, code: string): Promise<void> => {
//   await API.post("/auth/verify-email", { email, code });
// };


import { Platform } from "react-native";
import API, { TOKEN_KEY } from "./client";
import * as SecureStore from "expo-secure-store";

// Specific payload types for stronger TypeScript safety
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
}

// Cross-platform SecureStore wrapper (Prevents crashes on Web)
const saveToken = async (token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
};

const deleteToken = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
};

// 1. REGISTER USER -> Returns AuthResponse (JWT Token) to match AuthController
export const registerUser = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>("/auth/register", data);
  if (response.data?.token) {
    await saveToken(response.data.token);
  }
  return response.data;
};

// 2. LOGIN USER -> Saves JWT token & returns response
export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await API.post<AuthResponse>("/auth/login", data);
  if (response.data?.token) {
    await saveToken(response.data.token);
  }
  return response.data;
};

// 3. LOGOUT USER -> Clears saved token
export const logoutUser = async (): Promise<void> => {
  await deleteToken();
};

// 4. FORGOT PASSWORD -> Sends { email } object matching AuthController Map
export const requestPasswordReset = async (email: string): Promise<string> => {
  const response = await API.post<string>("/auth/forgot-password", { email });
  return response.data;
};

// 5. RESET PASSWORD -> Completes the password reset process
export const resetPassword = async (data: ResetPasswordRequest): Promise<string> => {
  const response = await API.post<string>("/auth/reset-password", data);
  return response.data;
};