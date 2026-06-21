import { useState } from "react";
import {
  StyleSheet,
  Switch,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function SettingsScreen() {
  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background"
  );

  const [username, setUsername] =
    useState("Gym Warrior");

  const [notifications, setNotifications] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(false);

  const [autoPlayVideos, setAutoPlayVideos] =
    useState(true);

  const saveSettings = () => {
    Alert.alert(
      "Settings Saved",
      "Your preferences have been updated."
    );

    // Later:
    // Save to Zustand
    // Save to Firebase
  };

  const resetSettings = () => {
    setUsername("Gym Warrior");
    setNotifications(true);
    setDarkMode(false);
    setAutoPlayVideos(true);

    Alert.alert(
      "Reset Complete",
      "Settings restored to default values."
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        Settings
      </ThemedText>

      <ThemedView
        style={[
          styles.card,
          { backgroundColor: cardBg },
        ]}
      >
        <ThemedText>
          Username
        </ThemedText>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter username"
        />
      </ThemedView>

      <ThemedView
        style={[
          styles.card,
          { backgroundColor: cardBg },
        ]}
      >
        <ThemedText>
          Notifications
        </ThemedText>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />
      </ThemedView>

      <ThemedView
        style={[
          styles.card,
          { backgroundColor: cardBg },
        ]}
      >
        <ThemedText>
          Dark Mode
        </ThemedText>

        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </ThemedView>

      <ThemedView
        style={[
          styles.card,
          { backgroundColor: cardBg },
        ]}
      >
        <ThemedText>
          Auto-play Workout Videos
        </ThemedText>

        <Switch
          value={autoPlayVideos}
          onValueChange={setAutoPlayVideos}
        />
      </ThemedView>

      <Pressable
        style={styles.saveButton}
        onPress={saveSettings}
      >
        <ThemedText>
          Save Settings
        </ThemedText>
      </Pressable>

      <Pressable
        style={styles.resetButton}
        onPress={resetSettings}
      >
        <ThemedText>
          Reset Settings
        </ThemedText>
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ThemedText>
          Back
        </ThemedText>
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
  card: {
    padding: 18,
    borderRadius: 16,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    padding: 12,
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
    backgroundColor: "#F59E0B",
  },
  backButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#9CA3AF",
  },
});