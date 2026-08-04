import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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
  WorkoutDay,
  Exercise,
  WorkoutPlan,
} from "@/services/aiService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkoutStore } from "@/stores/useWorkoutStore";

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
  timestamp?: string;
};

const STORAGE_KEY = "@fitconnect_ai_messages";

const QUICK_PROMPTS = [
  { label: "🏋️ 4-Day Muscle Split", prompt: "Generate a 4-day muscle building workout plan" },
  { label: "🔥 Fat Loss & Cardio", prompt: "Create a 3-day fat loss and conditioning routine" },
  { label: "💪 Analyze Physique", action: "photo" },
  { label: "🧘 Beginner Full Body", prompt: "I need a beginner 3-day full body workout routine" },
];

export default function AITrainer() {
  const user = useAuthStore((state) => state.user);
  const setPlanForDay = useWorkoutStore((state) => state.setPlanForDay);
  const setOngoingWorkout = useWorkoutStore((state) => state.setOngoingWorkout);

  const numericUserId = useMemo(() => {
    if (!user?.id) return undefined;
    const parsed = parseInt(user.id, 10);
    return isNaN(parsed) ? undefined : parsed;
  }, [user?.id]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const defaultWelcomeMessage = useMemo<Message>(
    () => ({
      id: "1",
      role: "ai",
      text: user?.displayName || user?.fullName
        ? `Hi ${user.displayName || user.fullName} 👋 I'm FITCONNECT AI! Ask me for a customized workout plan or upload a physique photo for analysis.`
        : "Hi 👋 I'm FITCONNECT AI! Ask me for a customized workout plan or upload a physique photo for analysis.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }),
    [user?.displayName, user?.fullName]
  );

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as Message[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          } else {
            setMessages([defaultWelcomeMessage]);
          }
        } else {
          setMessages([defaultWelcomeMessage]);
        }
      } catch (error) {
        console.warn("Failed to load AI chat history", error);
        setMessages([defaultWelcomeMessage]);
      } finally {
        setMessagesLoaded(true);
      }
    };

    loadHistory();
  }, [defaultWelcomeMessage]);

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
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1E293B" },
    "background",
  );
  const borderColor = useThemeColor(
    { light: "#E2E8F0", dark: "#334155" },
    "icon",
  );
  const textColor = useThemeColor({}, "text");
  const mutedTextColor = useThemeColor(
    { light: "#64748B", dark: "#94A3B8" },
    "icon",
  );
  const userBubbleColor = useThemeColor(
    { light: "#2563EB", dark: "#3B82F6" },
    "tint",
  );
  const aiBubbleColor = useThemeColor(
    { light: "#EFF6FF", dark: "#1E293B" },
    "background",
  );
  const inputBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1E293B" },
    "background",
  );
  const chipBg = useThemeColor(
    { light: "#F1F5F9", dark: "#334155" },
    "background",
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
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: screenBg,
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          marginBottom: 8,
        },
        headerLeft: {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        },
        aiBadge: {
          backgroundColor: userBubbleColor,
          width: 38,
          height: 38,
          borderRadius: 19,
          justifyContent: "center",
          alignItems: "center",
        },
        headerTitle: {
          color: textColor,
          fontSize: 18,
          fontWeight: "700",
        },
        headerSub: {
          color: mutedTextColor,
          fontSize: 12,
        },
        backBtn: {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: chipBg,
        },
        backText: {
          color: userBubbleColor,
          fontWeight: "600",
          fontSize: 14,
        },
        quickPromptsScroll: {
          maxHeight: 44,
          marginBottom: 8,
        },
        quickPromptsContainer: {
          gap: 8,
          paddingHorizontal: 2,
        },
        chip: {
          backgroundColor: chipBg,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          borderWidth: 1,
          borderColor,
        },
        chipText: {
          color: textColor,
          fontSize: 13,
          fontWeight: "500",
        },
        messageList: {
          flexGrow: 1,
          paddingBottom: 12,
        },
        message: {
          padding: 14,
          borderRadius: 16,
          maxWidth: "88%",
          marginBottom: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        userMsg: {
          backgroundColor: userBubbleColor,
          alignSelf: "flex-end",
          borderBottomRightRadius: 4,
        },
        aiMsg: {
          backgroundColor: aiBubbleColor,
          alignSelf: "flex-start",
          borderBottomLeftRadius: 4,
          borderWidth: 1,
          borderColor,
        },
        messageText: {
          color: textColor,
          fontSize: 15,
          lineHeight: 22,
        },
        whiteText: {
          color: "#FFFFFF",
          fontSize: 15,
          lineHeight: 22,
        },
        timestamp: {
          fontSize: 10,
          marginTop: 6,
          alignSelf: "flex-end",
        },
        attachmentImage: {
          width: 220,
          height: 160,
          borderRadius: 12,
          marginTop: 8,
          resizeMode: "cover",
        },
        attachmentMeta: {
          marginTop: 6,
          color: mutedTextColor,
          fontSize: 12,
          fontStyle: "italic",
        },
        workoutDayCard: {
          marginTop: 10,
          padding: 12,
          borderRadius: 12,
          backgroundColor: cardBg,
          borderWidth: 1,
          borderColor,
        },
        dayTitle: {
          fontWeight: "700",
          fontSize: 15,
          marginBottom: 8,
          color: textColor,
        },
        exerciseRow: {
          marginTop: 6,
          borderLeftWidth: 2,
          borderLeftColor: userBubbleColor,
          paddingLeft: 8,
        },
        exerciseName: {
          fontSize: 14,
          fontWeight: "600",
          color: textColor,
        },
        exerciseDetails: {
          fontSize: 12,
          color: mutedTextColor,
          marginTop: 2,
        },
        planActionsRow: {
          flexDirection: "row",
          gap: 8,
          marginTop: 12,
        },
        actionBtn: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 10,
          backgroundColor: userBubbleColor,
        },
        actionBtnOutline: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: userBubbleColor,
        },
        actionBtnText: {
          color: "#FFFFFF",
          fontWeight: "600",
          fontSize: 13,
        },
        actionBtnOutlineText: {
          color: userBubbleColor,
          fontWeight: "600",
          fontSize: 13,
        },
        inputRow: {
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        },
        input: {
          flex: 1,
          minHeight: 46,
          maxHeight: 120,
          borderWidth: 1,
          borderColor,
          borderRadius: 20,
          paddingHorizontal: 16,
          paddingVertical: 10,
          backgroundColor: inputBg,
          color: textColor,
          fontSize: 15,
        },
        iconBtn: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: chipBg,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor,
        },
        sendBtn: {
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: userBubbleColor,
          justifyContent: "center",
          alignItems: "center",
        },
        bottomRow: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
          paddingHorizontal: 4,
        },
        bottomAction: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingVertical: 4,
        },
        bottomActionText: {
          color: userBubbleColor,
          fontSize: 13,
          fontWeight: "600",
        },
      }),
    [
      aiBubbleColor,
      borderColor,
      cardBg,
      chipBg,
      inputBg,
      mutedTextColor,
      screenBg,
      textColor,
      userBubbleColor,
    ],
  );

  const sendUserPrompt = async (promptText: string) => {
    if (!promptText.trim() || loading) return;

    const formattedTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: promptText.trim(),
      timestamp: formattedTime,
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput("");
    setLoading(true);

    try {
      const expLevel = promptText.toLowerCase().includes("beginner")
        ? "BEGINNER"
        : promptText.toLowerCase().includes("advanced")
        ? "ADVANCED"
        : user?.level
        ? user.level.toUpperCase()
        : "INTERMEDIATE";

      const daysMatch = promptText.match(/(\d+)[ -]day/i);
      const daysCount = daysMatch ? parseInt(daysMatch[1], 10) : 4;

      const plan = await generateAiWorkoutPlan(
        {
          goal: promptText,
          experienceLevel: expLevel,
          daysPerWeek: isNaN(daysCount) ? 4 : daysCount,
        },
        numericUserId
      );

      const title = plan.plan_name || plan.title || "Custom AI Plan";
      const desc = plan.description ? `\n\n${plan.description}` : "";
      const responseText = `🤖 **${title}**${desc}\n\nHere is your custom workout breakdown:`;

      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: responseText,
          workoutPlan: plan,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("AI Generation Error:", error);
      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: "Sorry, I couldn't generate a plan right now. Please verify your connection or try again.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPlanToToday = (plan: WorkoutPlan) => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const planTitle = plan.title || plan.plan_name || "AI Generated Workout";
    const description = plan.description || "Custom AI Routine";

    let totalExercises = 0;
    if (plan.workouts && plan.workouts.length > 0) {
      totalExercises = plan.workouts[0].exercises?.length || 6;
    } else if (plan.exercises) {
      totalExercises = plan.exercises.length;
    }

    setPlanForDay(todayKey, {
      title: planTitle,
      description,
      durationMinutes: 45,
      exercises: totalExercises || 6,
    });

    Alert.alert(
      "Plan Saved! 🎯",
      `"${planTitle}" has been saved as your workout plan for today.`,
      [
        { text: "View Plan", onPress: () => router.push("/plan") },
        { text: "OK" },
      ]
    );
  };

  const handleStartWorkoutWithPlan = (plan: WorkoutPlan) => {
    const planTitle = plan.title || plan.plan_name || "AI Generated Workout";
    let exerciseCount = 6;
    if (plan.workouts && plan.workouts.length > 0) {
      exerciseCount = plan.workouts[0].exercises?.length || 6;
    }

    setOngoingWorkout({
      id: Date.now().toString(),
      title: planTitle,
      startedAt: new Date().toISOString(),
      exercises: exerciseCount,
    });

    router.push("/Workout");
  };

  const handleImageUpload = async (attachment: Attachment) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: "📷 Uploaded photo for physique & body composition analysis",
      attachment,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [userMessage, ...prev]);
    setLoading(true);

    try {
      const resultText = await analyzeBodyPhysique(
        {
          uri: attachment.uri,
          name: attachment.name ?? "physique.jpg",
          type: attachment.mimeType ?? "image/jpeg",
        },
        numericUserId
      );

      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: resultText || "Physique analysis completed!",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Physique Analysis Error:", error);
      setMessages((prev) => [
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: "Failed to analyze image. Please ensure your camera or media file is accessible.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please grant photo library access to upload photos."
      );
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
      Alert.alert(
        "Permission required",
        "Please grant camera access to take a photo."
      );
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
      Alert.alert("Permission required", "Please grant camera access.");
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
        text: `🎥 Shared video: ${asset.fileName ?? "video.mp4"}`,
        attachment: {
          kind: "video",
          uri: asset.uri,
          name: asset.fileName ?? "video.mp4",
          mimeType: asset.mimeType ?? "video/mp4",
        },
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "Video received! Video frame analysis will be supported in the next update.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      ...prev,
    ]);
  };

  const pickDocument = async () => {
    try {
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

      if (result.canceled || !result.assets?.[0]?.uri) return;

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
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: `Document "${asset.name}" attached. Ask me any questions about your plan!`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        ...prev,
      ]);
    } catch (error) {
      console.warn("Document picker error", error);
    }
  };

  const uploadAttachment = () => {
    Alert.alert("Attach File", "Select attachment type", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose Photo", onPress: pickImage },
      { text: "Record Video", onPress: recordVideo },
      { text: "Choose Document", onPress: pickDocument },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const clearChat = () => {
    Alert.alert("Clear Chat", "Are you sure you want to clear AI chat history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => {
          setMessages([defaultWelcomeMessage]);
          AsyncStorage.removeItem(STORAGE_KEY).catch(console.warn);
        },
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
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.aiBadge}>
                <Ionicons name="sparkles" size={20} color="#FFFFFF" />
              </View>
              <View>
                <ThemedText style={styles.headerTitle}>FITCONNECT AI</ThemedText>
                <ThemedText style={styles.headerSub}>
                  Smart Fitness Assistant
                </ThemedText>
              </View>
            </View>

            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <ThemedText style={styles.backText}>Back</ThemedText>
            </Pressable>
          </View>

          {/* Quick Prompts Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickPromptsScroll}
            contentContainerStyle={styles.quickPromptsContainer}
          >
            {QUICK_PROMPTS.map((item, index) => (
              <Pressable
                key={index}
                style={styles.chip}
                onPress={() => {
                  if (item.action === "photo") {
                    uploadAttachment();
                  } else if (item.prompt) {
                    sendUserPrompt(item.prompt);
                  }
                }}
              >
                <ThemedText style={styles.chipText}>{item.label}</ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          {/* Messages List */}
          <FlatList
            ref={flatListRef}
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

                {/* Structured Workout Days */}
                {item.workoutPlan?.workouts?.map((day: WorkoutDay, dIdx: number) => (
                  <View key={day.id ?? dIdx} style={styles.workoutDayCard}>
                    <ThemedText style={styles.dayTitle}>
                      {day.day ?? `Day ${dIdx + 1}`}: {day.focus ?? "Workout Focus"}
                    </ThemedText>
                    {day.exercises?.map((exercise: Exercise, eIdx: number) => (
                      <View key={exercise.id ?? eIdx} style={styles.exerciseRow}>
                        <ThemedText style={styles.exerciseName}>
                          • {exercise.name}
                        </ThemedText>
                        <ThemedText style={styles.exerciseDetails}>
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.rest_seconds ? ` (${exercise.rest_seconds}s rest)` : ""}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                ))}

                {/* Flat Exercise List fallback */}
                {!item.workoutPlan?.workouts &&
                  item.workoutPlan?.exercises?.map((exercise: Exercise, index: number) => (
                    <View
                      key={exercise.id ?? index}
                      style={styles.workoutDayCard}
                    >
                      <ThemedText style={styles.exerciseName}>
                        • {exercise.name}
                      </ThemedText>
                      <ThemedText style={styles.exerciseDetails}>
                        {exercise.sets} sets × {exercise.reps} reps
                      </ThemedText>
                    </View>
                  ))}

                {/* Quick Plan Actions */}
                {item.workoutPlan ? (
                  <View style={styles.planActionsRow}>
                    <Pressable
                      style={styles.actionBtn}
                      onPress={() => handleApplyPlanToToday(item.workoutPlan!)}
                    >
                      <Ionicons name="calendar-outline" size={16} color="#FFFFFF" />
                      <ThemedText style={styles.actionBtnText}>
                        Save as Today's Plan
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      style={[styles.actionBtn, styles.actionBtnOutline]}
                      onPress={() => handleStartWorkoutWithPlan(item.workoutPlan!)}
                    >
                      <Ionicons
                        name="play-outline"
                        size={16}
                        color={userBubbleColor}
                      />
                      <ThemedText style={styles.actionBtnOutlineText}>
                        Start Now
                      </ThemedText>
                    </Pressable>
                  </View>
                ) : null}

                {/* Attachments rendering */}
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

                {item.timestamp ? (
                  <ThemedText
                    style={[
                      styles.timestamp,
                      {
                        color:
                          item.role === "user"
                            ? "rgba(255,255,255,0.7)"
                            : mutedTextColor,
                      },
                    ]}
                  >
                    {item.timestamp}
                  </ThemedText>
                ) : null}
              </View>
            )}
          />

          {/* Input Area */}
          <View style={styles.inputRow}>
            <Pressable
              style={styles.iconBtn}
              onPress={uploadAttachment}
              disabled={loading}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={userBubbleColor}
              />
            </Pressable>

            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask AI trainer for a plan..."
              placeholderTextColor={mutedTextColor}
              style={styles.input}
              multiline
              maxLength={500}
              autoCapitalize="sentences"
              autoCorrect={false}
              selectionColor={userBubbleColor}
              returnKeyType="send"
              onSubmitEditing={() => sendUserPrompt(input)}
              blurOnSubmit={false}
            />

            <Pressable
              style={styles.sendBtn}
              onPress={() => sendUserPrompt(input)}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
              )}
            </Pressable>
          </View>

          {/* Bottom Actions Bar */}
          <View style={styles.bottomRow}>
            <Pressable onPress={clearChat} style={styles.bottomAction}>
              <Ionicons name="trash-outline" size={16} color={userBubbleColor} />
              <ThemedText style={styles.bottomActionText}>Clear Chat</ThemedText>
            </Pressable>

            <Pressable
              onPress={() => router.push("/Workout")}
              style={styles.bottomAction}
            >
              <Ionicons
                name="fitness-outline"
                size={16}
                color={userBubbleColor}
              />
              <ThemedText style={styles.bottomActionText}>Start Workout</ThemedText>
            </Pressable>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}
