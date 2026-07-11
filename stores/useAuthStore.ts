import { create } from "zustand";

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  goal?: string;
  level?: string;
}

interface AuthStore {
  user: User | null;
  loginCount: number;
  setUser: (user: User | null) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loginCount: 0,
  setUser: (user) => {
    set((state) => {
      if (!user) {
        return { user: null };
      }

      const shouldCountLogin = !state.user || state.user.id !== user.id;

      return {
        user,
        loginCount: shouldCountLogin ? state.loginCount + 1 : state.loginCount,
      };
    });
  },
  logout: () => set({ user: null }),
  updateProfile: async (updates) => {
    set((state) => {
      const currentUser = state.user;

      return {
        user: currentUser
          ? { ...currentUser, ...updates }
          : {
              id: updates.id ?? "local-user",
              email: updates.email ?? "guest@example.com",
              ...updates,
            },
      };
    });
  },
}));
