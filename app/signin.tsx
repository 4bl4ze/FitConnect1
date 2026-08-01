import { loginUser } from "@/services/authService";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
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
  const [showPassword, setShowPassword] = useState(false);
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
    if (!email.trim() || !password.trim()) {
      Alert.alert("Sign in error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // 1. Send credentials to Spring Boot API
      const response = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      // 2. Save session details to Zustand store
      setUser({
        id: email.trim().toLowerCase(),
        email: email.trim(),
        displayName: email.trim().split("@")[0],
        level: "Beginner",
        token: response.token, // Store JWT token if your user type supports it
      });

      // 3. Navigate to main tab navigator
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Login failed:", error);
      Alert.alert(
        "Sign in failed",
        error?.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
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
        <View style={styles.topRow}>
          <TouchableOpacity
            onPress={() => router.push("/" as never)}
            style={styles.backButton}
          >
            <ThemedText style={styles.backButtonText}>
              {"< Back to signup"}
            </ThemedText>
          </TouchableOpacity>
        </View>
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

          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                styles.inputWithButton,
                { backgroundColor: inputBg, borderColor, color: textColor },
              ]}
              placeholder="Password"
              placeholderTextColor={placeholderColor}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />
            <Pressable
              style={[
                styles.toggleIconButton,
                { borderColor, backgroundColor: inputBg },
              ]}
              onPress={() => setShowPassword((value) => !value)}
            >
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={22}
                color={textColor}
              />
            </Pressable>
          </View>

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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWithButton: {
    flex: 1,
    marginRight: 8,
  },
  toggleIconButton: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
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
  topRow: {
    marginBottom: 16,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(37,99,235,0.1)",
  },
  backButtonText: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
