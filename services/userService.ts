// import API from "./client";

// // Matches your Spring Boot User model structure
// export interface User {
//   id?: string | number;
//   email: string;
//   fullName?: string;
//   displayName?: string;
//   password?: string;
//   goal?: string;
//   level?: string;
//   photoURL?: string;
// }

// // 1. GET ALL USERS -> @GetMapping("/api/users")
// export const getAllUsers = async (): Promise<User[]> => {
//   const response = await API.get<User[]>("/users");
//   return response.data;
// };

// // 2. CREATE USER -> @PostMapping("/api/users")
// export const createUser = async (userData: User): Promise<User> => {
//   const response = await API.post<User>("/users", userData);
//   return response.data;
// };

// // 3. GET USER BY ID -> @GetMapping("/api/users/{id}")
// export const getUserById = async (id: string | number): Promise<User> => {
//   const response = await API.get<User>(`/users/${id}`);
//   return response.data;
// };

// // 4. UPDATE USER -> @PutMapping("/api/users/{id}") or @PutMapping("/api/users")
// export const updateUser = async (id: string | number, userData: Partial<User>): Promise<User> => {
//   const response = await API.put<User>(`/users/${id}`, userData);
//   return response.data;
// };



import API from "./client";

// Matches your Spring Boot User model structure
export interface User {
  id?: string | number;
  email: string;
  fullName?: string;
  displayName?: string;
  password?: string;
  goal?: string;
  level?: string;
  photoURL?: string;
}

// 1. GET ALL USERS -> @GetMapping("/api/users")
export const getAllUsers = async (): Promise<User[]> => {
  const response = await API.get<User[]>("/users");
  return response.data;
};

// 2. CREATE USER -> @PostMapping("/api/users")
export const createUser = async (userData: User): Promise<User> => {
  const response = await API.post<User>("/users", userData);
  return response.data;
};

// 3. GET USER BY ID -> @GetMapping("/api/users/{id}")
export const getUserById = async (id: string | number): Promise<User> => {
  const response = await API.get<User>(`/users/${id}`);
  return response.data;
};

// 4. UPDATE USER BY EMAIL -> @PutMapping("/api/users/{email}")
export const updateUser = async (
  email: string,
  userData: Partial<User>
): Promise<User> => {
  // Maps displayName to fullName if provided, matching your Spring Boot User model
  const payload = {
    ...userData,
    fullName: userData.fullName || userData.displayName,
  };

  const response = await API.put<User>(`/users/${encodeURIComponent(email)}`, payload);
  return response.data;
};