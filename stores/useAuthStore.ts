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
  notificationCount: number;
  notifications: Array<{ id: string; title: string; body?: string }>;
  setUser: (user: User | null) => void;
  clearNotifications: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loginCount: 0,
  notificationCount: 3,
  notifications: [
    { id: "n1", title: "Welcome to FitConnect", body: "Thanks for joining!" },
    {
      id: "n2",
      title: "New feature",
      body: "Try the AI trainer for custom plans.",
    },
    { id: "n3", title: "Reminder", body: "Don't forget today's workout." },
  ],
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
  clearNotifications: () => set({ notificationCount: 0, notifications: [] }),
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
