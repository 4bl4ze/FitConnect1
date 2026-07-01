
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

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Missing Info", "Please fill all fields.");
      return;
    }

    const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(fullName)) {
  Alert.alert("Invalid Name", "Full name should contain letters only.");
  return;
}

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    Alert.alert("Success", "Account created successfully!", [
      {
        text: "Continue",
        onPress: () => router.replace("/(tabs)"),
      },
    ]);
  };

  



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled" // <-- ADD THIS LINE
        showsVerticalScrollIndicator={false}
        >
        {/* HEADER */}
        <ThemedText type="title" style={styles.title}>
          Join FitConnect
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Build strength. Track progress. Stay consistent.
        </ThemedText>

        {/* FORM */}
        <View style={styles.form}>
          <TextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />

          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* CTA BUTTON */}

        {/* Replace your CTA button with this test setup */}

        <Pressable 
          onPress={() => router.push("./forgotPassword")} 
          style={styles.forgotPasswordContainer}
        >
          <ThemedText style={styles.forgotPasswordText}>Forgot password?</ThemedText>
        </Pressable>

        <Pressable style={styles.button} onPress={handleSignup}>
          <ThemedText style={styles.buttonText}>
            Create Account
          </ThemedText>
        </Pressable>



     

        {/* SIGN IN OPTION */}
        <View style={styles.bottomRow}>
          <ThemedText>Already have an account?</ThemedText>

          <Pressable onPress={() => router.push("./signin")}>
            <ThemedText style={styles.link}>Sign In</ThemedText>
          </Pressable>
        </View>
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
    flexGrow:1
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

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  forgotPasswordText: {
    color: "#6B7280",
    fontSize: 14,
    textDecorationLine: "underline",
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 6,
  },

  link: {
    color: BLUE,
    fontWeight: "700",
  },
});