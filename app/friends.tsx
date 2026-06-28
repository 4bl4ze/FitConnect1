import { useState } from "react";
import { View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { ThemedText } from "@/components/themed-text";

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

  // SEND FRIEND REQUEST
  const sendRequest = (id: string) => {
    setFriends((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "pending" } : f
      )
    );
  };

  // ACCEPT REQUEST
  const acceptRequest = (id: string) => {
    setFriends((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, status: "accepted" } : f
      )
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
    <View style={styles.container}>
      <ThemedText type="title">Friends</ThemedText>

      {/* SEARCH USERS */}
      <TextInput
        placeholder="Search users..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />

      {/* FRIEND LIST */}
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ThemedText type="defaultSemiBold">
              {item.name}
            </ThemedText>

            {item.status === "none" && (
              <Pressable
                style={styles.button}
                onPress={() => sendRequest(item.id)}
              >
                <ThemedText style={styles.buttonText}>
                  Add Friend
                </ThemedText>
              </Pressable>
            )}

            {item.status === "pending" && (
              <ThemedText style={{ color: "orange" }}>
                Request Sent
              </ThemedText>
            )}

            {item.status === "accepted" && (
              <ThemedText style={{ color: "green" }}>
                Friends ✓
              </ThemedText>
            )}
          </View>
        )}
      />

      {/* CHAT SECTION (ONLY FOR ACCEPTED FRIENDS) */}
      <View style={styles.chatBox}>
        <ThemedText type="subtitle">Chat</ThemedText>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.message}>
              <ThemedText>{item.text}</ThemedText>
            </View>
          )}
        />

        <View style={styles.chatInputRow}>
          <TextInput
            placeholder="Type message..."
            value={messageText}
            onChangeText={setMessageText}
            style={styles.chatInput}
          />

          <Pressable style={styles.sendBtn} onPress={sendMessage}>
            <ThemedText style={{ color: "#fff" }}>
              Send
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    gap: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: BLUE,
    padding: 12,
    borderRadius: 10,
  },

  card: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
    backgroundColor: "#F9FAFB",
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
    borderColor: "#E5E7EB",
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
    borderColor: BLUE,
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
    backgroundColor: "#EEF2FF",
    marginVertical: 5,
    borderRadius: 8,
  },
});