import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/useAuthStore";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background",
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>
      <ThemedView style={[styles.profileCard, { backgroundColor: cardBg }]}>
        <ThemedText type="defaultSemiBold">
          {user?.displayName ?? "Guest User"}
        </ThemedText>
        <ThemedText>Gym level: Intermediate</ThemedText>
        <ThemedText>Goal: Build strength and consistency</ThemedText>
      </ThemedView>
      <View style={styles.actions}>
        <Button title="Edit Profile" onPress={() =>  { router.push("/editprofile")}} />
        <Button title="Subscriptions" onPress={() => {router.push("/subscriptions")}} />
        <Button title="Settings" onPress={() => { router.push("/settings")}} />
      </View>
      {user ? (
        <Button title="Log out" onPress={logout} />
      ) : (
        <ThemedText style={styles.hint}>
          Sign in through the auth flow to access your profile and
          subscriptions.
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  profileCard: {
    padding: 24,
    borderRadius: 22,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  actions: {
    gap: 14,
  },
  hint: {
    marginTop: 12,
    lineHeight: 20,
  },
});
