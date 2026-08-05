import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState("");
  const [expectedCode, setExpectedCode] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const inputBg = useThemeColor(
    { light: "#FAFAFA", dark: "#111827" },
    "background",
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "icon",
  );
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    // send code when the screen mounts
    sendVerificationCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendVerificationCode = () => {
    const generated = generateCode();
    setExpectedCode(generated);
    setSending(true);

    // Simulate sending email (replace with real API call)
    setTimeout(() => {
      setSending(false);
      Alert.alert(
        "Verification Sent",
        `A verification code has been sent to ${email ?? "your email"}.\n(For demo: ${generated})`,
      );
    }, 700);
  };

  const handleVerify = () => {
    if (!code.trim()) {
      Alert.alert("Enter Code", "Please enter the verification code.");
      return;
    }

    if (code.trim() === expectedCode) {
      Alert.alert("Verified", "Email verified successfully!", [
        { text: "Continue", onPress: () => router.replace("/(tabs)") },
      ]);
    } else {
      Alert.alert("Invalid Code", "The code you entered is incorrect.");
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip verification",
      "You can continue without verification. You can verify later in settings.",
      [
        { text: "Continue", onPress: () => router.replace("/(tabs)") },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText type="title">Verify your email</ThemedText>

        <ThemedText style={styles.info}>
          We sent a 6-digit code to {email ?? "your email"}. Enter it below to
          verify your account.
        </ThemedText>

        <View style={styles.form}>
          <TextInput
            placeholder="Enter code"
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={[
              styles.input,
              { backgroundColor: inputBg, borderColor, color: textColor },
            ]}
            maxLength={6}
          />

          <Pressable style={[styles.button]} onPress={handleVerify}>
            <ThemedText style={styles.buttonText}>Verify</ThemedText>
          </Pressable>

          <Pressable
            style={[styles.secondary]}
            onPress={sendVerificationCode}
            disabled={sending}
          >
            <ThemedText style={styles.secondaryText}>
              {sending ? "Resending..." : "Resend code"}
            </ThemedText>
          </Pressable>

          <Pressable style={[styles.ghost]} onPress={handleSkip}>
            <ThemedText style={styles.ghostText}>
              Continue without verification
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, flexGrow: 1, justifyContent: "center" },
  info: { marginTop: 12, marginBottom: 18 },
  form: { gap: 12 },
  input: { borderWidth: 1, padding: 14, borderRadius: 10 },
  button: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  secondary: { marginTop: 8, alignItems: "center" },
  secondaryText: { color: "#2563EB", fontWeight: "700" },
  ghost: { marginTop: 18, alignItems: "center" },
  ghostText: { color: "#6B7280" },
});
