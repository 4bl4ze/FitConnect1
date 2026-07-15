import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
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
    { light: "#2563EB", dark: "#60A5FA" },
    "tint",
  );
  const disabledButtonColor = useThemeColor(
    { light: "#93C5FD", dark: "#1D4ED8" },
    "tint",
  );

  const handleResetRequest = async () => {
    // 1. Basic validation
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);

      // 2. Mock API Call (Replace this with your actual backend/Firebase/Supabase auth call)
      // await auth.sendPasswordResetEmail(email);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulating network latency

      // 3. Success Feedback
      Alert.alert(
        "Reset Email Sent",
        "Check your inbox for instructions to reset your password.",
        [
          {
            text: "Back to Sign In",
            onPress: () => router.replace("./signin"),
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
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
