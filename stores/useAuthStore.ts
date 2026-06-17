import { create } from "zustand";

type User = {
  id: string;
  displayName: string;
};

type AuthState = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (u: User) => set({ user: u }),
  logout: () => set({ user: null }),
}));

export default useAuthStore;
