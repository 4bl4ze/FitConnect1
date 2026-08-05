import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/useAuthStore";

export default function NotificationsScreen() {
  const notifications = useAuthStore((s) => s.notifications);
  const clearNotifications = useAuthStore((s) => s.clearNotifications);

  const backgroundColor = useThemeColor({}, "background");
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#111827" },
    "background",
  );
  const muted = useThemeColor({ light: "#6B7280", dark: "#9CA3AF" }, "icon");

  const handleBack = () => {
    clearNotifications();
    router.back();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <ThemedText type="title">Notifications</ThemedText>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <ThemedText style={styles.backText}>Back</ThemedText>
        </Pressable>
      </View>

      {notifications && notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: cardBg }]}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText style={{ color: muted }}>{item.body}</ThemedText>
            </View>
          )}
        />
      ) : (
        <ThemedView style={[styles.empty, { backgroundColor: cardBg }]}>
          <ThemedText>No notifications</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  backBtn: { padding: 8 },
  backText: { color: "#2563EB", fontWeight: "700" },
  list: { gap: 12 },
  item: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    gap: 6,
  },
  empty: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
});
