
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  analyzeBodyPhysique,
  generateAiWorkoutPlan,
  WorkoutPlan,
} from "@/services/aiService"; // Ensure correct import path

type AttachmentKind = "image" | "video" | "document";

type Attachment = {
  kind: AttachmentKind;
  uri: string;
  name?: string;
  mimeType?: string | null;
};

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  attachment?: Attachment;
  workoutPlan?: WorkoutPlan;
};

const STORAGE_KEY = "@fitconnect_ai_messages";

export default function AITrainer() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Hi 👋 I’m FITCONNECT AI. Ask me for a workout plan or upload a physique photo for analysis!",
    },
  ]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Message[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch (error) {
        console.warn("Failed to load AI chat history", error);
      } finally {
        setMessagesLoaded(true);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    const saveHistory = async () => {
      if (!messagesLoaded) return;

      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.warn("Failed to save AI chat history", error);
      }
    };

    saveHistory();
  }, [messages, messagesLoaded]);

  const screenBg = useThemeColor(
    { light: "#F8FAFC", dark: "#0F172A" },
    "background",
  );
  const borderColor = useThemeColor(
    { light: "#D1D5DB", dark: "#4B5563" },
    "icon",
  );
  const textColor = useThemeColor({}, "text");
  const mutedTextColor = useThemeColor(
    { light: "#6B7280", dark: "#9CA3AF" },
    "icon",
  );
  const userBubbleColor = useThemeColor(
    { light: "#2563EB", dark: "#3B82F6" },
    "tint",
  );
  const aiBubbleColor = useThemeColor(
    { light: "#DBEAFE", dark: "#1E3A8A" },
    "background",
  );
  const inputBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F2937" },
    "background",
  );
  const inputPlaceholderColor = useThemeColor(
    { light: "#6B7280", dark: "#D1D5DB" },
    "icon",
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: screenBg,
        },
        keyboardView: {
          flex: 1,
        },
        safeArea: {
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          backgroundColor: screenBg,
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        },
        headerTitle: {
          color: textColor,
        },
        messageList: {
          flexGrow: 1,
          paddingBottom: 12,
        },
        message: {
          padding: 12,
          borderRadius: 12,
          maxWidth: "85%",
          marginBottom: 10,
        },
        userMsg: {
          backgroundColor: userBubbleColor,
          alignSelf: "flex-end",
        },
        aiMsg: {
          backgroundColor: aiBubbleColor,
          alignSelf: "flex-start",
        },
        messageText: {
          color: textColor,
        },
        whiteText: {
          color: "#FFFFFF",
          fontWeight: "600",
        },
        blueText: {
          color: userBubbleColor,
          fontWeight: "600",
        },
        attachmentImage: {
          width: 180,
          height: 140,
          borderRadius: 10,
          marginTop: 8,
          resizeMode: "cover",
        },
        attachmentMeta: {
          marginTop: 6,
          color: mutedTextColor,
          fontSize: 12,
        },
        exerciseCard: {
          marginTop: 8,
          padding: 8,
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
        },
        inputRow: {
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 10,
          marginTop: 10,
        },
        input: {
          flex: 1,
          minHeight: 48,
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: inputBg,
          color: textColor,
          fontSize: 15,
        },
        uploadBtn: {
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          backgroundColor: inputBg,
          minHeight: 48,
          justifyContent: "center",
          alignItems: "center",
        },
        uploadText: {
          color: userBubbleColor,
          fontWeight: "700",
          fontSize: 16,
        },
        sendBtn: {
          backgroundColor: userBubbleColor,
          paddingHorizontal: 14,
          paddingVertical: 12,
          borderRadius: 12,
          minHeight: 48,
          justifyContent: "center",
          alignItems: "center",
        },
        bottomRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          gap: 10,
        },
        bottomAction: {
          paddingVertical: 6,
        },
      }),
    [
      aiBubbleColor,
      borderColor,
      inputBg,
      mutedTextColor,
      screenBg,
      textColor,
      userBubbleColor,
    ],
  );

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: userText,
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput("");
    setLoading(true);

    try {
      // Basic heuristic to parse prompt intent into request DTO
      const plan = await generateAiWorkoutPlan({
        goal: userText,
        experienceLevel: userText.toLowerCase().includes("beginner")
          ? "BEGINNER"
          : "INTERMEDIATE",
        daysPerWeek: 4,
      });

      const responseText = plan.description
        ? `${plan.title ?? "Workout Plan"}\n\n${plan.description}`
        : `Here is your customized workout plan: ${plan.title ?? ""}`;

      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: responseText,
          workoutPlan: plan,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: "Sorry, I couldn't generate a plan right now. Please check your backend service.",
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (attachment: Attachment) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: "📷 Shared an image for body analysis",
      attachment,
    };

    setMessages((prev) => [userMessage, ...prev]);
    setLoading(true);

    try {
      const resultText = await analyzeBodyPhysique({
        uri: attachment.uri,
        name: attachment.name ?? "physique.jpg",
        type: attachment.mimeType ?? "image/jpeg",
      });

      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: resultText || "Physique analysis completed!",
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Physique Analysis Error:", error);
      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: "Failed to analyze image. Please ensure your Spring Boot server endpoint is active.",
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    handleImageUpload({
      kind: "image",
      uri: asset.uri,
      name: asset.fileName ?? "image.jpg",
      mimeType: asset.mimeType ?? "image/jpeg",
    });
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    handleImageUpload({
      kind: "image",
      uri: asset.uri,
      name: asset.fileName ?? "photo.jpg",
      mimeType: asset.mimeType ?? "image/jpeg",
    });
  };

  const recordVideo = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setMessages((prev) => [
      {
        id: Date.now().toString(),
        role: "user",
        text: `🎥 Shared video: ${asset.fileName ?? "video"}`,
        attachment: {
          kind: "video",
          uri: asset.uri,
          name: asset.fileName ?? "video",
          mimeType: asset.mimeType ?? "video/mp4",
        },
      },
      {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "Video uploaded. Video analysis will be available in an upcoming release.",
      },
      ...prev,
    ]);
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/*",
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });

    const resultType = (result as any).type;
    if (resultType === "cancel" || !result.assets?.[0]?.uri) return;

    const asset = result.assets[0];
    setMessages((prev) => [
      {
        id: Date.now().toString(),
        role: "user",
        text: `📄 Shared document: ${asset.name}`,
        attachment: {
          kind: "document",
          uri: asset.uri,
          name: asset.name,
          mimeType: asset.mimeType,
        },
      },
      {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "Document received and processed.",
      },
      ...prev,
    ]);
  };

  const uploadAttachment = () => {
    Alert.alert("Upload", "Choose what to attach", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Record Video", onPress: recordVideo },
      { text: "Choose Image", onPress: pickImage },
      { text: "Choose Document", onPress: pickDocument },
      { text: "Cancel", style: "cancel" },
    ]);
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
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.headerTitle}>
              FITCONNECT AI
            </ThemedText>

            <Pressable onPress={() => router.back()}>
              <ThemedText style={styles.blueText}>Back</ThemedText>
            </Pressable>
          </View>

          <FlatList
            data={messages}
            inverted
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            renderItem={({ item }) => (
              <View
                style={[
                  styles.message,
                  item.role === "user" ? styles.userMsg : styles.aiMsg,
                ]}
              >
                <ThemedText
                  style={
                    item.role === "user" ? styles.whiteText : styles.messageText
                  }
                >
                  {item.text}
                </ThemedText>

                {/* Render structured exercise list from backend */}
                {item.workoutPlan?.exercises?.map((exercise, index) => (
                  <View key={exercise.id ?? index} style={styles.exerciseCard}>
                    <ThemedText style={styles.messageText}>
                      • {exercise.name}: {exercise.sets} sets x {exercise.reps} reps
                    </ThemedText>
                  </View>
                ))}

                {item.attachment?.kind === "image" && item.attachment.uri ? (
                  <Image
                    source={{ uri: item.attachment.uri }}
                    style={styles.attachmentImage}
                  />
                ) : null}

                {item.attachment?.kind === "video" ? (
                  <ThemedText style={styles.attachmentMeta}>
                    🎥 {item.attachment.name ?? "Video attached"}
                  </ThemedText>
                ) : null}

                {item.attachment?.kind === "document" ? (
                  <ThemedText style={styles.attachmentMeta}>
                    📄 {item.attachment.name ?? "Document attached"}
                  </ThemedText>
                ) : null}
              </View>
            )}
          />

          <View style={styles.inputRow}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask your AI trainer..."
              placeholderTextColor={inputPlaceholderColor}
              style={styles.input}
              multiline
              maxLength={500}
              autoCapitalize="sentences"
              autoCorrect={false}
              selectionColor={userBubbleColor}
              returnKeyType="done"
              blurOnSubmit={false}
            />

            <Pressable
              style={styles.uploadBtn}
              onPress={uploadAttachment}
              disabled={loading}
            >
              <ThemedText style={styles.uploadText}>+</ThemedText>
            </Pressable>

            <Pressable
              style={styles.sendBtn}
              onPress={sendMessage}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <ThemedText style={styles.whiteText}>Send</ThemedText>
              )}
            </Pressable>
          </View>

          <View style={styles.bottomRow}>
            <Pressable onPress={clearChat} style={styles.bottomAction}>
              <ThemedText style={styles.blueText}>Clear Chat</ThemedText>
            </Pressable>

            <Pressable
              onPress={() => router.push("/Workout")}
              style={styles.bottomAction}
            >
              <ThemedText style={styles.blueText}>Start Workout</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}