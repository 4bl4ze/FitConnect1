import { router } from "expo-router";
import React, { useState } from "react";
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
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [showSettings, setShowSettings] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);

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
  const mutedTextColor = useThemeColor(
    { light: "#6B7280", dark: "#9CA3AF" },
    "icon",
  );

  const profileName = user?.displayName ?? "Guest User";
  const profileEmail = user?.email ?? "No email provided";
  const profileGoal = user?.goal ?? "Set a goal";
  const profileLevel = user?.level ?? "Set your level";
  const profileImage =
    user?.photoURL ??
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
      <ThemedText type="title">Profile</ThemedText>
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
                trackColor={{ false: "#D1D5DB", true: "#2563EB" }}
                thumbColor={pushEnabled ? "#FFFFFF" : "#F3F4F6"}
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
      </View>{" "}
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
          style={{ color: "#DC2626", fontWeight: "600", fontSize: 16 }}
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
    paddingBottom: 40,
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
