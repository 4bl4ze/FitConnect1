import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

const BLUE = "#2563EB";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const toggleBg = useThemeColor(
    { light: "#fff", dark: "#1F1F1F" },
    "background",
  );
  const toggleTextColor = useThemeColor(
    { light: "#2563EB", dark: "#60A5FA" },
    "tint",
  );
  const forgotTextColor = useThemeColor(
    { light: "#6B7280", dark: "#9CA3AF" },
    "icon",
  );

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

    // Navigate to verification step where we send a code to the user's email
    // Use object form to avoid strict typed path issues in expo-router
    router.push({ pathname: "/verify", params: { email } } as any);
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
        <View style={styles.headerRow}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
          />
          <ThemedText type="title" style={styles.title}>
            Join FitConnect
          </ThemedText>
        </View>

        <ThemedText style={[styles.subtitle, { color: subtitleColor }]}>
          Build strength. Track progress. Stay consistent.
        </ThemedText>

        <View style={styles.form}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor={placeholderColor}
            value={fullName}
            onChangeText={setFullName}
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor, color: textColor },
            ]}
          />

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
          />

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={placeholderColor}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[
                styles.input,
                styles.inputWithButton,
                { backgroundColor: inputBg, borderColor, color: textColor },
              ]}
            />

            <Pressable
              style={[
                styles.toggleButton,
                { borderColor, backgroundColor: toggleBg },
              ]}
              onPress={() => setShowPassword((value) => !value)}
            >
              <ThemedText
                style={[styles.toggleText, { color: toggleTextColor }]}
              >
                {showPassword ? "Hide" : "Show"}
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor={placeholderColor}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={[
                styles.input,
                styles.inputWithButton,
                { backgroundColor: inputBg, borderColor, color: textColor },
              ]}
            />

            <Pressable
              style={[
                styles.toggleButton,
                { borderColor, backgroundColor: toggleBg },
              ]}
              onPress={() => setShowConfirmPassword((value) => !value)}
            >
              <ThemedText
                style={[styles.toggleText, { color: toggleTextColor }]}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </ThemedText>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("./forgotPassword")}
          style={styles.forgotPasswordContainer}
        >
          <ThemedText
            style={[styles.forgotPasswordText, { color: forgotTextColor }]}
          >
            Forgot password?
          </ThemedText>
        </Pressable>

        <Pressable style={styles.button} onPress={handleSignup}>
          <ThemedText style={styles.buttonText}>Create Account</ThemedText>
        </Pressable>

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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 8,
  },

  logo: {
    width: 64,
    height: 64,
    resizeMode: "contain",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: 30,
  },

  form: {
    gap: 12,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
  },

  inputWithButton: {
    flex: 1,
    marginRight: 8,
  },

  toggleButton: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  toggleText: {
    fontWeight: "600",
    fontSize: 13,
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
