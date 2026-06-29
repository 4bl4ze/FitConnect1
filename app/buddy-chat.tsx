import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

type Message = {
  id: string;
  role: "user" | "buddy";
  text: string;
};

export default function BuddyChatScreen() {
  const params = useLocalSearchParams<{ name?: string }>();
  const router = useRouter();
  const buddyName = params.name ?? "Buddy";

  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "buddy",
      text: `Hey, I’m ${buddyName}. What’s your workout plan today?`,
    },
  ]);

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
  const userBubbleBg = useThemeColor(
    { light: "#2563EB", dark: "#3B82F6" },
    "tint",
  );
  const buddyBubbleBg = useThemeColor(
    { light: "#E5E7EB", dark: "#1F2937" },
    "background",
  );

  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-reply",
          role: "buddy",
          text: `Nice, I’d help you build that routine.`,
        },
      ]);
    }, 700);
  };

  const chatTitle = `Chat with ${buddyName}`;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={85}
    >
      <ThemedView style={[styles.header, { backgroundColor: cardBg }]}>
        <Pressable onPress={() => router.back()}>
          <ThemedText type="defaultSemiBold">Back</ThemedText>
        </Pressable>
        <ThemedText type="title">{chatTitle}</ThemedText>
        <View style={{ width: 46 }} />
      </ThemedView>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              {
                alignSelf: item.role === "user" ? "flex-end" : "flex-start",
                backgroundColor:
                  item.role === "user" ? userBubbleBg : buddyBubbleBg,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.messageText,
                { color: item.role === "user" ? "#FFFFFF" : textColor },
              ]}
            >
              {item.text}
            </ThemedText>
          </View>
        )}
      />

      <View style={[styles.inputRow, { backgroundColor: cardBg }]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: inputBg,
              color: textColor,
              borderColor,
            },
          ]}
          value={text}
          onChangeText={setText}
          placeholder={`Message ${buddyName}`}
          placeholderTextColor={useThemeColor(
            { light: "#6B7280", dark: "#D1D5DB" },
            "icon",
          )}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />

        <Pressable style={styles.sendButton} onPress={sendMessage}>
          <ThemedText style={styles.sendButtonText}>Send</ThemedText>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  messageList: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  messageBubble: {
    borderRadius: 16,
    padding: 14,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    alignItems: "center",
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  sendButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#2563EB",
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
