import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { ChatMessage, chatService } from "@/services/chatService";

export default function BuddyChatScreen() {
  const params = useLocalSearchParams<{ name?: string; email?: string }>();
  const router = useRouter();

  const buddyName = params.name ?? "Buddy";
  const otherUserEmail = params.email ?? ""; // Ensure email is passed in navigation params

  const [text, setText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

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

  // 1. Fetch Chat History & Connect to WebSocket
  useEffect(() => {
    let isMounted = true;

    async function initializeChat() {
      if (!otherUserEmail) {
        console.warn("No user email provided for chat routing.");
        setLoading(false);
        return;
      }

      try {
        // Fetch historical messages REST
        const history = await chatService.getChatHistory(otherUserEmail);
        if (isMounted) {
          setMessages(history);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        if (isMounted) setLoading(false);
      }

      // Connect to STOMP WebSocket for real-time incoming messages
      await chatService.connect(
        (incomingMessage) => {
          // Verify message belongs to current active conversation
          if (
            incomingMessage.senderEmail === otherUserEmail ||
            incomingMessage.receiverEmail === otherUserEmail
          ) {
            setMessages((prev) => [...prev, incomingMessage]);
          }
        },
        (error) => console.error("WebSocket Error:", error),
      );
    }

    initializeChat();

    // Clean up connection when leaving the screen
    return () => {
      isMounted = false;
      chatService.disconnect();
    };
  }, [otherUserEmail]);

  // 2. Handle Sending Live Message
  const sendMessage = () => {
    if (!text.trim() || !otherUserEmail) return;

    const messageText = text.trim();
    setText("");

    const success = chatService.sendMessage(otherUserEmail, messageText);

    if (success) {
      // Optimistically append local message to list
      const optimisticMsg: ChatMessage = {
        id: Date.now().toString(),
        receiverEmail: otherUserEmail,
        content: messageText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);
    } else {
      console.warn("Failed to publish message over STOMP connection.");
    }
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id ?? index.toString()}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => {
            // Message is from the user if receiverEmail matches otherUserEmail
            const isUser = item.receiverEmail === otherUserEmail;

            return (
              <View
                style={[
                  styles.messageBubble,
                  {
                    alignSelf: isUser ? "flex-end" : "flex-start",
                    backgroundColor: isUser ? userBubbleBg : buddyBubbleBg,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.messageText,
                    { color: isUser ? "#FFFFFF" : textColor },
                  ]}
                >
                  {item.content}
                </ThemedText>
              </View>
            );
          }}
        />
      )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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