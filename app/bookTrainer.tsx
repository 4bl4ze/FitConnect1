import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

type TrainerType = "Strength" | "Cardio" | "Yoga";

export default function BookTrainer() {
  const [trainer, setTrainer] = useState<TrainerType>("Strength");

  const [date, setDate] = useState("");
  const screenBg = useThemeColor(
    { light: "#F8FAFC", dark: "#0F172A" },
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
  const optionBg = useThemeColor(
    { light: "#FFFFFF", dark: "#111827" },
    "background",
  );
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const confirmBooking = () => {
    if (!date || !time) {
      Alert.alert("Error", "Please select date and time");
      return;
    }

    Alert.alert(
      "Booking Confirmed 🎉",
      `Trainer: ${trainer}\nDate: ${date}\nTime: ${time}`,
    );
  };

  const resetForm = () => {
    setTrainer("Strength");
    setDate("");
    setTime("");
    setNotes("");
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: screenBg }]}>
      <ThemedText type="title">Book Trainer</ThemedText>

      {/* TRAINER TYPE */}
      <ThemedText type="subtitle">Choose Trainer</ThemedText>

      <View style={styles.row}>
        {["Strength", "Cardio", "Yoga"].map((t) => (
          <Pressable
            key={t}
            onPress={() => setTrainer(t as TrainerType)}
            style={[
              styles.option,
              { backgroundColor: optionBg, borderColor },
              trainer === t && styles.selected,
            ]}
          >
            <ThemedText
              style={trainer === t ? styles.whiteText : styles.blueText}
            >
              {t}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {/* DATE */}
      <ThemedText type="subtitle">Date</ThemedText>

      <TextInput
        placeholder="e.g. 2026-01-30"
        placeholderTextColor={mutedTextColor}
        value={date}
        onChangeText={setDate}
        style={[
          styles.input,
          { backgroundColor: inputBg, borderColor, color: textColor },
        ]}
      />

      {/* TIME */}
      <ThemedText type="subtitle">Time</ThemedText>

      <TextInput
        placeholder="e.g. 10:00 AM"
        placeholderTextColor={mutedTextColor}
        value={time}
        onChangeText={setTime}
        style={[
          styles.input,
          { backgroundColor: inputBg, borderColor, color: textColor },
        ]}
      />

      {/* NOTES */}
      <ThemedText type="subtitle">Notes</ThemedText>

      <TextInput
        placeholder="Optional notes..."
        placeholderTextColor={mutedTextColor}
        value={notes}
        onChangeText={setNotes}
        style={[
          styles.input,
          { backgroundColor: inputBg, borderColor, color: textColor },
        ]}
      />

      {/* ACTIONS */}
      <Pressable style={styles.bookBtn} onPress={confirmBooking}>
        <ThemedText style={styles.whiteText}>Confirm Booking</ThemedText>
      </Pressable>

      <Pressable style={styles.resetBtn} onPress={resetForm}>
        <ThemedText style={styles.blueText}>Reset</ThemedText>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <ThemedText style={styles.blueText}>Back</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const BLUE = "#2563EB";
const LIGHT = "#DBEAFE";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 14,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  option: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },

  selected: {
    backgroundColor: BLUE,
  },

  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
  },

  bookBtn: {
    backgroundColor: BLUE,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  resetBtn: {
    backgroundColor: LIGHT,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
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
