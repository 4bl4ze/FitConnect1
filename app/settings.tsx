import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getUserById, updateUser } from "@/services/userService";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SettingsScreen() {
  const { user, updateProfile } = useAuthStore();

  const [username, setUsername] = useState(user?.displayName ?? "Gym Warrior");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const inputBorder = useThemeColor(
    { light: "#CCC", dark: "#4B5563" },
    "icon"
  );

  // 1. Fetch current user profile & settings from backend on mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const backendUser = await getUserById(user.id);
        if (backendUser.displayName || backendUser.fullName) {
          setUsername(backendUser.displayName || backendUser.fullName || "");
        }
      } catch (error) {
        console.error("Failed to load user settings from backend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, [user?.id]);

  // 2. Save settings to backend API & sync AuthStore
  const saveSettings = async () => {
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        displayName: username.trim(),
        fullName: username.trim(),
      };

      // Update backend via userService.ts
      if (user?.id) {
        await updateUser(user.id, payload);
      }

      // Sync local Zustand state store
      await updateProfile({
        displayName: username.trim(),
      });

      Alert.alert("Settings Saved", "Your preferences have been updated.");
    } catch (error) {
      console.error("Failed to save settings:", error);
      Alert.alert("Error", "Could not save settings to backend server.");
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setUsername(user?.displayName ?? "Gym Warrior");
    setNotifications(true);
    setDarkMode(false);
    setAutoPlayVideos(true);

    Alert.alert(
      "Reset Complete",
      "Settings restored to default values."
    );
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>

      {/* Username Card */}
      <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
        <ThemedText>Username</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: inputBorder, color: textColor }]}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
          placeholderTextColor="#9CA3AF"
          editable={!saving}
        />
      </ThemedView>

      {/* Notifications Switch */}
      <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
        <ThemedText>Notifications</ThemedText>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
          trackColor={{ false: "#767577", true: "#007AFF" }}
          thumbColor={notifications ? "#FFFFFF" : "#F4F3F4"}
        />
      </ThemedView>

      {/* Dark Mode Switch */}
      <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
        <ThemedText>Dark Mode</ThemedText>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#767577", true: "#007AFF" }}
          thumbColor={darkMode ? "#FFFFFF" : "#F4F3F4"}
        />
      </ThemedView>

      {/* Auto-play Videos Switch */}
      <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
        <ThemedText>Auto-play Workout Videos</ThemedText>
        <Switch
          value={autoPlayVideos}
          onValueChange={setAutoPlayVideos}
          trackColor={{ false: "#767577", true: "#007AFF" }}
          thumbColor={autoPlayVideos ? "#FFFFFF" : "#F4F3F4"}
        />
      </ThemedView>

      {/* Save Button */}
      <Pressable
        style={[styles.saveButton, { opacity: saving ? 0.7 : 1 }]}
        onPress={saveSettings}
        disabled={saving}
      >
        <ThemedText style={styles.buttonText}>
          {saving ? "Saving..." : "Save Settings"}
        </ThemedText>
      </Pressable>

      {/* Reset Button */}
      <Pressable
        style={styles.resetButton}
        onPress={resetSettings}
        disabled={saving}
      >
        <ThemedText style={styles.buttonText}>Reset Settings</ThemedText>
      </Pressable>

      {/* Back Button */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={saving}
      >
        <ThemedText style={styles.buttonText}>Back</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    padding: 18,
    borderRadius: 16,
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    flex: 1,
    marginLeft: 10,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#22C55E",
  },
  resetButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "red",
  },
  backButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});