import { create } from "zustand";

export type ThemeMode = "light" | "dark";

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  mode: "light",
  setMode: (mode) => set({ mode }),
}));
