import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { requestPasswordReset } from "@/services/authService";
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
    View,
} from "react-native";

const BLUE = "#2563EB";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const backgroundColor = useThemeColor({}, "background");
  const inputBg = useThemeColor(
    { light: "#FAFAFA", dark: "#1F1F1F" },
    "background",
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#4B5563" },
    "icon",
  );
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor(
    { light: "#6B7280", dark: "#D1D5DB" },
    "icon",
  );
  const subtitleColor = useThemeColor(
    { light: "#6B7280", dark: "#D1D5DB" },
    "icon",
  );
  const linkColor = useThemeColor(
    { light: "#2563EB", dark: "#2563EB" },
    "tint",
  );
  const disabledButtonColor = useThemeColor(
    { light: "#2563EB", dark: "#2563EB" },
    "tint",
  );

  const handleResetRequest = async () => {
    // 1. Basic validation
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);

      // 2. Real API Call to Spring Boot
      await requestPasswordReset(email.trim());

      // 3. Success Feedback — NOW ROUTE TO RESET PASSWORD SCREEN 🚀
      Alert.alert(
        "Reset Email Sent",
        "Check your inbox for your token, then tap 'Enter Token' to continue.",
        [
          {
            text: "Enter Token",
            onPress: () =>
              router.push({
                pathname: "/resetPassword",
                params: { email: email.trim() },
              }),
          },
        ],
      );
    } catch (error: any) {
      console.error("Password reset error:", error);

      const errorMessage =
        error?.response?.data?.message ||
        (typeof error?.response?.data === "string"
          ? error.response.data
          : null) ||
        "Something went wrong. Please try again later.";

      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { backgroundColor }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <ThemedText type="title" style={styles.title}>
          Reset Password
        </ThemedText>

        <ThemedText style={[styles.subtitle, { color: subtitleColor }]}>
          Enter your FitConnect email and we will send you a link to get back
          into your account.
        </ThemedText>

        {/* FORM */}
        <View style={styles.form}>
          <TextInput
            placeholder="Email address"
            placeholderTextColor={placeholderColor}
            value={email}
            onChangeText={setEmail}
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor, color: textColor },
            ]}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        {/* CTA BUTTON */}
        <Pressable
          style={[
            styles.button,
            isLoading && { backgroundColor: disabledButtonColor },
          ]}
          onPress={handleResetRequest}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </ThemedText>
        </Pressable>

        {/* BACK TO LOGIN */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={[styles.link, { color: linkColor }]}>
            Back to Sign Up
          </ThemedText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 24,
    justifyContent: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: BLUE,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
  },
  button: {
    backgroundColor: BLUE,
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  link: {
    fontWeight: "700",
  },
});
