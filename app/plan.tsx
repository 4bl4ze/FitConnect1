import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useWorkoutStore } from "@/stores/useWorkoutStore";

export default function PlanScreen() {
  const setPlanForDay = useWorkoutStore((state) => state.setPlanForDay);
  const plansByDay = useWorkoutStore((state) => state.plansByDay);

  const dayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const currentPlan = plansByDay[dayKey];

  const [title, setTitle] = useState(currentPlan?.title ?? "");
  const [description, setDescription] = useState(
    currentPlan?.description ?? "",
  );
  const [duration, setDuration] = useState(
    currentPlan?.durationMinutes?.toString() ?? "45",
  );
  const [exercises, setExercises] = useState(
    currentPlan?.exercises?.toString() ?? "6",
  );

  const screenBg = useThemeColor(
    { light: "#F8FAFC", dark: "#0F172A" },
    "background",
  );
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#111827" },
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
  const buttonBg = useThemeColor({ light: "#2563EB", dark: "#60A5FA" }, "tint");

  const savePlan = () => {
    setPlanForDay(dayKey, {
      title: title.trim() || "Custom plan",
      description: description.trim() || "A focused workout session",
      durationMinutes: Number(duration) || 45,
      exercises: Number(exercises) || 6,
    });
    router.back();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: screenBg }]}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Today’s Plan</ThemedText>
        <Pressable onPress={() => router.back()}>
          <ThemedText style={{ color: buttonBg, fontWeight: "700" }}>
            Back
          </ThemedText>
        </Pressable>
      </View>

      <ThemedView
        style={[styles.card, { backgroundColor: cardBg, borderColor }]}
      >
        <ThemedText type="subtitle">Plan details</ThemedText>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Plan title"
          placeholderTextColor={mutedTextColor}
          style={[styles.input, { borderColor, color: textColor }]}
        />

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Short description"
          placeholderTextColor={mutedTextColor}
          style={[styles.input, { borderColor, color: textColor }]}
        />

        <View style={styles.row}>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholder="45"
            placeholderTextColor={mutedTextColor}
            style={[styles.smallInput, { borderColor, color: textColor }]}
          />
          <TextInput
            value={exercises}
            onChangeText={setExercises}
            keyboardType="numeric"
            placeholder="6"
            placeholderTextColor={mutedTextColor}
            style={[styles.smallInput, { borderColor, color: textColor }]}
          />
        </View>

        <Pressable
          style={[styles.saveBtn, { backgroundColor: buttonBg }]}
          onPress={savePlan}
        >
          <ThemedText style={styles.saveText}>Save plan</ThemedText>
        </Pressable>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  card: { padding: 18, borderRadius: 18, borderWidth: 1, gap: 12 },
  input: { borderWidth: 1, borderRadius: 10, padding: 12 },
  row: { flexDirection: "row", gap: 10 },
  smallInput: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 12 },
  saveBtn: { paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "700" },
});
