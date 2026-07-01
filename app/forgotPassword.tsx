import { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { ThemedText } from "@/components/themed-text";

const BLUE = "#2563EB";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <ThemedText type="title" style={styles.title}>
          Reset Password
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Enter your FitConnect email and we will send you a link to get back into your account.
        </ThemedText>

        {/* FORM */}
        <View style={styles.form}>
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        {/* CTA BUTTON */}
        <Pressable 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleResetRequest}
          disabled={isLoading}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </ThemedText>
        </Pressable>

        {/* BACK TO LOGIN */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.link}>Back to Sign Up</ThemedText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    color: "#555",
    lineHeight: 20,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
  },
  button: {
    backgroundColor: BLUE,
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#93C5FD",
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
    color: BLUE,
    fontWeight: "700",
  },
});