import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/stores/useAuthStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const notificationCount = useAuthStore((state) => state.notificationCount);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: Colors[colorScheme ?? "light"].icon,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: isDark ? "#1a1a1a" : "#ffffff",
            borderTopColor: isDark ? "#333" : "#e5e7eb",
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 64,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginBottom: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ focused }) => (
              <IconSymbol
                size={28}
                name="house.fill"
                color={
                  focused ? "#007AFF" : Colors[colorScheme ?? "light"].icon
                }
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="magnifyingglass" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <View style={{ width: 28, height: 28 }}>
                <IconSymbol size={28} name="person.crop.circle" color={color} />
                {notificationCount > 0 ? (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -8,
                      minWidth: 18,
                      height: 18,
                      borderRadius: 9,
                      backgroundColor: "#EF4444",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <ThemedText
                      type="caption"
                      style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}
                    >
                      {notificationCount}
                    </ThemedText>
                  </View>
                ) : null}
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
