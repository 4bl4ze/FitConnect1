import { router } from "expo-router";
import { useState } from "react";
import { loginUser, type LoginRequest } from "@/services/authService";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  const backgroundColor = useThemeColor({}, "background");
  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background",
  );
  const inputBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F1F1F" },
    "background",
  );
  const borderColor = useThemeColor(
    { light: "#D1D5DB", dark: "#4B5563" },
    "icon",
  );
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor(
    { light: "#6B7280", dark: "#D1D5DB" },
    "icon",
  );
  const buttonBg = useThemeColor({ light: "#2563EB", dark: "#3B82F6" }, "tint");

  const handleSignIn = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      Alert.alert("Sign in error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const payload: LoginRequest = {
        email: normalizedEmail,
        password: normalizedPassword,
        fullName: normalizedEmail.split("@")[0] || "FitConnect User",
      };

      const response = await loginUser(payload);

      setUser({
        id: normalizedEmail,
        email: normalizedEmail,
        displayName: normalizedEmail.split("@")[0] || "FitConnect User",
        level: "Beginner",
        token: response.token,
      });

      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login failed:", error);

      let errorMessage = "Invalid email or password. Please try again.";
      if (typeof error?.response?.data === "string") {
        errorMessage = error.response.data;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Sign in failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { backgroundColor }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <ThemedText type="title">Sign In</ThemedText>
          <ThemedText style={styles.subtitle}>
            Enter your credentials to continue.
          </ThemedText>

          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor, color: textColor },
            ]}
            placeholder="Email"
            placeholderTextColor={placeholderColor}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            returnKeyType="next"
          />

          <TextInput
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor, color: textColor },
            ]}
            placeholder="Password"
            placeholderTextColor={placeholderColor}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: buttonBg, opacity: loading ? 0.7 : 1 },
            ]}
            onPress={handleSignIn}
            disabled={loading}
          >
            <ThemedText style={styles.buttonText}>
              {loading ? "Signing in..." : "Sign In"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              setUser({
                id: "guest",
                email: "guest@example.com",
                displayName: "Guest",
                level: "Beginner",
              });
              router.replace("/(tabs)");
            }}
          >
            <ThemedText style={styles.secondaryText}>
              Continue as guest
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    gap: 16,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: 16,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  secondaryButton: {
    alignItems: "center",
    marginTop: 12,
  },
  secondaryText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
