import { LoginRequest, loginUser } from "@/services/authService";
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
  const subtitleColor = useThemeColor(
    { light: "#6B7280", dark: "#D1D5DB" },
    "icon",
  );
  const placeholderColor = useThemeColor(
    { light: "#6B7280", dark: "#D1D5DB" },
    "icon",
  );
  const buttonBg = useThemeColor({ light: "#2563EB", dark: "#2563EB" }, "tint");
  const backButtonBg = useThemeColor(
    { light: "rgba(37,99,235,0.1)", dark: "rgba(37,99,235,0.15)" },
    "background",
  );
  const backButtonTextColor = useThemeColor(
    { light: "#2563EB", dark: "#2563EB" },
    "tint",
  );
  const linkColor = useThemeColor(
    { light: "#2563EB", dark: "#2563EB" },
    "tint",
  );

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Sign in error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      const payload: LoginRequest = {
        email: normalizedEmail,
        password: normalizedPassword,
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

      const isNetworkOrServerError =
        !error?.response ||
        error?.code === "ECONNABORTED" ||
        error?.code === "ERR_NETWORK" ||
        error?.response?.status >= 500 ||
        (typeof error?.response?.data?.message === "string" &&
          (error.response.data.message.includes("JDBC") ||
            error.response.data.message.includes("SQL") ||
            error.response.data.message.includes("transaction")));

      const normalizedEmail = email.trim().toLowerCase();

      if (isNetworkOrServerError) {
        Alert.alert(
          "Server Connection Issue",
          "The authentication server is temporarily unreachable or undergoing maintenance. Would you like to sign in using Offline/Local Mode?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Sign In (Offline Mode)",
              onPress: () => {
                setUser({
                  id: normalizedEmail,
                  email: normalizedEmail,
                  displayName: normalizedEmail.split("@")[0] || "FitConnect User",
                  level: "Beginner",
                });
                router.replace("/(tabs)");
              },
            },
          ]
        );
        return;
      }

      let errorMessage =
        "Invalid email or password. Please check your credentials or create a new account.";
      if (typeof error?.response?.data?.message === "string" && !error.response.data.message.includes("JDBC")) {
        errorMessage = error.response.data.message;
      } else if (typeof error?.response?.data?.diagnosticError === "string" && !error.response.data.diagnosticError.includes("JDBC")) {
        errorMessage = error.response.data.diagnosticError;
      }

      Alert.alert(
        "Sign In Failed",
        errorMessage,
        [
          { text: "Try Again", style: "cancel" },
          {
            text: "Create Account",
            onPress: () => router.push("/" as never),
          },
          {
            text: "Guest Mode",
            onPress: () => {
              setUser({
                id: "guest",
                email: "guest@example.com",
                displayName: "Guest",
                level: "Beginner",
              });
              router.replace("/(tabs)");
            },
          },
        ]
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
            style={[styles.backButton, { backgroundColor: backButtonBg }]}
          >
            <ThemedText
              style={[styles.backButtonText, { color: backButtonTextColor }]}
            >
              {"< Back to signup"}
            </ThemedText>
          </TouchableOpacity>
        </View>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <ThemedText type="title" style={{ color: textColor }}>
            Sign In
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: subtitleColor }]}>
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
            <ThemedText style={[styles.secondaryText, { color: linkColor }]}>
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
