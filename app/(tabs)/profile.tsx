import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllUsers } from "@/services/userService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";

export default function ProfileScreen() {
  const { user, logout, notificationCount, updateProfile } = useAuthStore();
  const [showSettings, setShowSettings] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

  // Re-fetch user profile from backend on screen focus to reflect recent changes
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const fetchProfile = async () => {
        if (!user?.email) return;

        try {
          const users = await getAllUsers();
          if (Array.isArray(users)) {
            const currentUserData = users.find(
              (u) => u.email && u.email.toLowerCase() === user.email.toLowerCase(),
            );

            if (currentUserData && isMounted) {
              await updateProfile({
                fullName: currentUserData.fullName,
                displayName:
                  currentUserData.fullName || currentUserData.displayName,
                goal: currentUserData.goal,
                level: currentUserData.level,
                photoURL: currentUserData.photoURL,
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch updated user profile:", error);
        }
      };

      fetchProfile();

      return () => {
        isMounted = false;
      };
    }, [user?.email, updateProfile]),
  );

  const themeMode = useThemeStore((state) => state.mode);
  const setThemeMode = useThemeStore((state) => state.setMode);

  const backgroundColor = useThemeColor({}, "background");
  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background",
  );
  const buttonBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F1F1F" },
    "background",
  );
  const buttonBorderColor = useThemeColor(
    { light: "#D1D5DB", dark: "#4B5563" },
    "icon",
  );
  const buttonTextColor = useThemeColor(
    { light: "#2563EB", dark: "#3B82F6" },
    "tint",
  );
  const dangerButtonBg = useThemeColor(
    { light: "#FEE2E2", dark: "#7F1D1D" },
    "background",
  );
  const dangerTextColor = useThemeColor(
    { light: "#B91C1C", dark: "#FEE2E2" },
    "text",
  );
  const mutedTextColor = useThemeColor(
    { light: "#6B7280", dark: "#9CA3AF" },
    "icon",
  );

  // Safely fallback to fullName or displayName
  const profileName = user?.fullName || user?.displayName || "Guest User";
  const profileEmail = user?.email ?? "No email provided";
  const profileGoal = user?.goal || "Set a goal";
  const profileLevel = user?.level || "Set your level";
  const profileImage =
    user?.photoURL ||
    "https://via.placeholder.com/120?text=" + encodeURIComponent(profileName);

  const toggleTheme = () => {
    setThemeMode(themeMode === "dark" ? "light" : "dark");
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor }]}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <ThemedText type="title">Profile</ThemedText>
        <TouchableOpacity
          style={[
            styles.notificationButton,
            { backgroundColor: buttonBg, borderColor: buttonBorderColor },
          ]}
          onPress={() => router.push("/notifications")}
        >
          <IconSymbol size={24} name="bell.fill" color={buttonTextColor} />
          {notificationCount > 0 ? (
            <View style={styles.notificationBadge}>
              <ThemedText style={styles.notificationBadgeText}>
                {notificationCount}
              </ThemedText>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>

      <ThemedView style={[styles.profileCard, { backgroundColor: cardBg }]}>
        <View style={styles.profileImageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </View>

        <View style={styles.profileInfoContainer}>
          <ThemedText type="title">{profileName}</ThemedText>
          <ThemedText>{profileEmail}</ThemedText>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold">{profileLevel}</ThemedText>
            <ThemedText>Gym level</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText type="defaultSemiBold">{profileGoal}</ThemedText>
            <ThemedText>Goal</ThemedText>
          </View>
        </View>
      </ThemedView>

      <View style={styles.actionsSection}>
        <ThemedText type="subtitle">Account</ThemedText>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: buttonBg, borderColor: buttonBorderColor },
          ]}
          onPress={() => router.push("/editprofile")}
        >
          <ThemedText style={{ color: buttonTextColor, fontWeight: "600" }}>
            ✏️ Edit Profile
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: buttonBg, borderColor: buttonBorderColor },
          ]}
          onPress={() => router.push("/subscriptions")}
        >
          <ThemedText style={{ color: buttonTextColor, fontWeight: "600" }}>
            💳 Subscriptions
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: buttonBg, borderColor: buttonBorderColor },
          ]}
          onPress={() => setShowSettings((prev) => !prev)}
        >
          <ThemedText style={{ color: buttonTextColor, fontWeight: "600" }}>
            ⚙️ Settings
          </ThemedText>
        </TouchableOpacity>

        {showSettings && (
          <ThemedView
            style={[styles.settingsCard, { backgroundColor: cardBg }]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingTextWrap}>
                <ThemedText type="defaultSemiBold">
                  Push notifications
                </ThemedText>
                <ThemedText style={{ color: mutedTextColor }}>
                  Get reminders and updates
                </ThemedText>
              </View>

              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{
                  false: themeMode === "dark" ? "#4B5563" : "#D1D5DB",
                  true: "#2563EB",
                }}
                thumbColor={
                  pushEnabled
                    ? "#FFFFFF"
                    : themeMode === "dark"
                      ? "#9CA3AF"
                      : "#6B7280"
                }
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingTextWrap}>
                <ThemedText type="defaultSemiBold">Theme</ThemedText>
                <ThemedText style={{ color: mutedTextColor }}>
                  {themeMode === "dark" ? "Dark mode" : "Light mode"}
                </ThemedText>
              </View>

              <TouchableOpacity
                style={[
                  styles.themeButton,
                  {
                    backgroundColor:
                      themeMode === "dark" ? "#1F1F1F" : "#FFFFFF",
                    borderColor: buttonBorderColor,
                  },
                ]}
                onPress={toggleTheme}
              >
                <ThemedText
                  style={{
                    color: themeMode === "dark" ? "#FFFFFF" : buttonTextColor,
                    fontWeight: "600",
                  }}
                >
                  {themeMode === "dark" ? "Dark" : "Light"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.logoutButton,
          {
            backgroundColor: dangerButtonBg,
            borderColor: buttonBorderColor,
          },
        ]}
        onPress={() => {
          logout();
          router.replace("/signin");
        }}
      >
        <ThemedText
          style={{ color: dangerTextColor, fontWeight: "600", fontSize: 16 }}
        >
          Log out
        </ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 20,
    paddingBottom: 120,
  },
  profileCard: {
    padding: 24,
    borderRadius: 22,
    gap: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "cover",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,0.1)",
  },
  profileInfoContainer: {
    alignItems: "center",
    gap: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 40,
    marginTop: 12,
    width: "100%",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  settingsCard: {
    padding: 16,
    borderRadius: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  notificationButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  settingTextWrap: {
    flex: 1,
    gap: 2,
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    marginTop: 4,
  },
});
