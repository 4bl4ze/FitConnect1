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

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email");
      return;
    }

    // 🔥 TEMP AUTH (replace later with Firebase/Supabase)
    Alert.alert("Success", "Signed in successfully!", [
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
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HEADER */}
        <ThemedText type="title" style={styles.title}>
          Welcome Back
        </ThemedText>

        <ThemedText style={styles.subtitle}>
          Sign in to continue your fitness journey
        </ThemedText>

        {/* FORM */}
        <View style={styles.form}>
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
        </View>

        {/* BUTTON */}
        <Pressable style={styles.button} onPress={handleSignIn}>
          <ThemedText style={styles.buttonText}>
            Sign In
          </ThemedText>
        </Pressable>

        {/* SIGN UP LINK */}
        <View style={styles.bottomRow}>
          <ThemedText>Don’t have an account?</ThemedText>

          <Pressable onPress={() => router.replace("/")}>
            <ThemedText style={styles.link}>
              Sign Up
            </ThemedText>
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
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
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