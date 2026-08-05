import { useColorScheme as useSystemColorScheme } from "react-native";

import { useThemeStore } from "@/stores/useThemeStore";

export function useColorScheme() {
  const systemScheme = useSystemColorScheme();
  const themeMode = useThemeStore((state) => state.mode);

  if (themeMode === "dark" || themeMode === "light") {
    return themeMode;
  }

  return systemScheme ?? "light";
}
