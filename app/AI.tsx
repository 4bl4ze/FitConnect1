import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { router } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

export default function AITrainer() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Hi 👋 I’m your AI Trainer. Ask me for a workout plan!",
    },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };

    setMessages((prev) => [userMessage, ...prev]);

    const aiReply = generateAIResponse(input);

    setTimeout(() => {
      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: aiReply,
        },
        ...prev,
      ]);
    }, 600);

    setInput("");
  };

  const generateAIResponse = (text: string) => {
    const msg = text.toLowerCase();

    if (msg.includes("chest")) {
      return "Try: Bench Press (4x8), Incline Dumbbell Press (3x10), Push-ups (3 sets).";
    }

    if (msg.includes("legs")) {
      return "Leg day: Squats (4x8), Lunges (3x12), Leg press (3x10).";
    }

    if (msg.includes("abs")) {
      return "Abs workout: Planks (3x45s), Crunches (3x15), Leg raises (3x12).";
    }

    if (msg.includes("beginner")) {
      return "Beginner plan: Full body 3x/week — push-ups, squats, rows, planks.";
    }

    return "I can help you with chest, legs, abs or full workout plans. Try asking!";
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "ai",
        text: "Chat cleared. Ask me for a new workout plan!",
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <ThemedText type="title">AI Trainer</ThemedText>

        <Pressable onPress={() => router.back()}>
          <ThemedText style={styles.blueText}>
            Back
          </ThemedText>
        </Pressable>
      </View>

      {/* CHAT */}
      <FlatList
        data={messages}
        inverted
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.role === "user"
                ? styles.userMsg
                : styles.aiMsg,
            ]}
          >
            <ThemedText
              style={
                item.role === "user"
                  ? styles.whiteText
                  : styles.blueText
              }
            >
              {item.text}
            </ThemedText>
          </View>
        )}
      />

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask your AI trainer..."
          style={styles.input}
        />

        <Pressable
          style={styles.sendBtn}
          onPress={sendMessage}
        >
          <ThemedText style={styles.whiteText}>
            Send
          </ThemedText>
        </Pressable>
      </View>

      {/* ACTIONS */}
      <View style={styles.bottomRow}>
        <Pressable onPress={clearChat}>
          <ThemedText style={styles.blueText}>
            Clear Chat
          </ThemedText>
        </Pressable>

        <Pressable onPress={() => router.push("/Workout")}>
          <ThemedText style={styles.blueText}>
            Start Workout
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const BLUE = "#2563EB";
const LIGHT = "#DBEAFE";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  message: {
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
  },

  userMsg: {
    backgroundColor: BLUE,
    alignSelf: "flex-end",
  },

  aiMsg: {
    backgroundColor: LIGHT,
    alignSelf: "flex-start",
  },

  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: BLUE,
    borderRadius: 10,
    padding: 10,
  },

  sendBtn: {
    backgroundColor: BLUE,
    padding: 12,
    borderRadius: 10,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  whiteText: {
    color: "#fff",
    fontWeight: "600",
  },

  blueText: {
    color: BLUE,
    fontWeight: "600",
  },
});