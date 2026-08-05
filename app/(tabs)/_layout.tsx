import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 38 + (insets.bottom ?? 0);

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#2563EB",
          tabBarInactiveTintColor: Colors[colorScheme ?? "light"].icon,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 0,
            height: TAB_BAR_HEIGHT,
            paddingBottom: insets.bottom ? 1 : 0,
            borderRadius: 24,
            backgroundColor: isDark ? "#0b0b0b" : "#ffffff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 5,
            borderTopWidth: 0,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
            marginTop: 2,
          },
          tabBarIconStyle: {
            marginBottom: -8,
            transform: [{ translateY: 0 }],
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ focused, color }) => (
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: focused ? "#2563EB" : "transparent",
                }}
              >
                <IconSymbol
                  size={20}
                  name="house.fill"
                  color={focused ? "#fff" : color}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: focused ? "#2563EB" : "transparent",
                }}
              >
                <IconSymbol
                  size={20}
                  name="magnifyingglass"
                  color={focused ? "#fff" : color}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <View style={{ width: 44, height: 44, borderRadius: 22 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: focused ? "#2563EB" : "transparent",
                  }}
                >
                  <IconSymbol
                    size={20}
                    name="person.crop.circle"
                    color={focused ? "#fff" : color}
                  />
                </View>
                {notificationCount > 0 ? (
                  <View
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
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
                      type="subtitle"
                      style={{
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: "700",
                        lineHeight: 18,
                      }}
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
