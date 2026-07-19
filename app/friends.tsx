import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";

const BLUE = "#2563EB";

type Friend = {
  id: string;
  name: string;
  status: "none" | "pending" | "accepted";
};

type Message = {
  id: string;
  text: string;
  from: string;
};

export default function FriendsScreen() {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState<Friend[]>([
    { id: "1", name: "John Mensah", status: "none" },
    { id: "2", name: "Sarah Johnson", status: "pending" },
    { id: "3", name: "Michael Brown", status: "accepted" },
  ]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");

  const screenBg = useThemeColor(
    { light: "#F8FAFC", dark: "#0F172A" },
    "background",
  );
  const cardBg = useThemeColor(
    { light: "#F9FAFB", dark: "#111827" },
    "background",
  );
  const inputBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background",
  );
  const borderColor = useThemeColor(
    { light: "#E5E7EB", dark: "#374151" },
    "icon",
  );
  const textColor = useThemeColor(
    { light: "#0F172A", dark: "#F9FAFB" },
    "text",
  );
  const mutedTextColor = useThemeColor(
    { light: "#64748B", dark: "#94A3B8" },
    "icon",
  );
  const messageBg = useThemeColor(
    { light: "#EEF2FF", dark: "#1E293B" },
    "background",
  );

  // SEND FRIEND REQUEST
  const sendRequest = (id: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "pending" } : f)),
    );
  };

  // ACCEPT REQUEST
  const acceptRequest = (id: string) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "accepted" } : f)),
    );
  };

  // SEND MESSAGE (ONLY IF ACCEPTED)
  const sendMessage = () => {
    const friend = friends.find((f) => f.status === "accepted");

    if (!friend) {
      alert("You must be friends to chat");
      return;
    }

    if (!messageText.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: messageText,
        from: "me",
      },
    ]);

    setMessageText("");
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: screenBg }]}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Friends</ThemedText>

        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <ThemedText style={styles.backButtonText}>← Home</ThemedText>
        </Pressable>
      </View>

      {/* SEARCH USERS */}
      <TextInput
        placeholder="Search users..."
        placeholderTextColor={mutedTextColor}
        value={search}
        onChangeText={setSearch}
        style={[
          styles.input,
          { backgroundColor: inputBg, borderColor, color: textColor },
        ]}
      />

      {/* FRIEND LIST */}
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>

            {item.status === "none" && (
              <Pressable
                style={styles.button}
                onPress={() => sendRequest(item.id)}
              >
                <ThemedText style={styles.buttonText}>Add Friend</ThemedText>
              </Pressable>
            )}

            {item.status === "pending" && (
              <ThemedText style={{ color: "orange" }}>Request Sent</ThemedText>
            )}

            {item.status === "accepted" && (
              <ThemedText style={{ color: "green" }}>Friends ✓</ThemedText>
            )}
          </View>
        )}
      />

      {/* CHAT SECTION (ONLY FOR ACCEPTED FRIENDS) */}
      <View style={[styles.chatBox, { borderColor }]}>
        <ThemedText type="subtitle">Chat</ThemedText>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.message, { backgroundColor: messageBg }]}>
              <ThemedText>{item.text}</ThemedText>
            </View>
          )}
        />

        <View style={styles.chatInputRow}>
          <TextInput
            placeholder="Type message..."
            placeholderTextColor={mutedTextColor}
            value={messageText}
            onChangeText={setMessageText}
            style={[
              styles.chatInput,
              { backgroundColor: inputBg, borderColor, color: textColor },
            ]}
          />

          <Pressable style={styles.sendBtn} onPress={sendMessage}>
            <ThemedText style={{ color: "#fff" }}>Send</ThemedText>
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },

  backButtonText: {
    color: BLUE,
    fontWeight: "700",
  },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
  },

  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },

  button: {
    marginTop: 10,
    backgroundColor: BLUE,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },

  chatBox: {
    marginTop: 20,
    borderTopWidth: 1,
    paddingTop: 15,
    flex: 1,
  },

  chatInputRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  chatInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },

  sendBtn: {
    backgroundColor: BLUE,
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },

  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
});
