import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useWorkoutStore } from "@/stores/useWorkoutStore";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function StreakHistoryScreen() {
  const completedDays = useWorkoutStore((state) => state.completedDays);
  const streakDays = useWorkoutStore((state) => state.streakDays);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();

  const screenBg = useThemeColor(
    { light: "#F8FAFC", dark: "#0F172A" },
    "background",
  );
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#111827" },
    "background",
  );
  const accent = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const daysInMonth = useMemo(() => {
    const baseDate = new Date(year, month, 1);
    const dayCount = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: dayCount }).map((_, idx) => {
      const d = new Date(year, month, idx + 1);
      const key = d.toISOString().slice(0, 10);
      return {
        day: idx + 1,
        completed: Boolean(completedDays[key]),
      };
    });
  }, [completedDays, month, year]);

  return (
    <ThemedView style={[styles.container, { backgroundColor: screenBg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerRow}>
          <ThemedText type="title">Streak History</ThemedText>
          <Pressable onPress={() => router.back()}>
            <ThemedText style={[styles.link, { color: accent }]}>
              Back
            </ThemedText>
          </Pressable>
        </View>

        <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.selectRow}>
            <Pressable
              onPress={() => {
                const next = new Date(year, month - 1, 1);
                setSelectedDate(next);
              }}
              style={styles.selectButton}
            >
              <ThemedText>Prev</ThemedText>
            </Pressable>
            <ThemedText type="subtitle" style={styles.monthLabel}>
              {monthNames[month]} {year}
            </ThemedText>
            <Pressable
              onPress={() => {
                const next = new Date(year, month + 1, 1);
                setSelectedDate(next);
              }}
              style={styles.selectButton}
            >
              <ThemedText>Next</ThemedText>
            </Pressable>
          </View>

          <View style={styles.grid}>
            {daysInMonth.map((day) => (
              <View
                key={day.day}
                style={[
                  styles.dayCell,
                  day.completed && { backgroundColor: accent },
                ]}
              >
                <ThemedText
                  style={[
                    styles.dayLabel,
                    { color: day.completed ? "#fff" : textColor },
                  ]}
                >
                  {" "}
                  {day.day}{" "}
                </ThemedText>
              </View>
            ))}
          </View>
        </ThemedView>

        <ThemedView style={[styles.card, { backgroundColor: cardBg }]}>
          <ThemedText type="subtitle">Current streak</ThemedText>
          <ThemedText type="title" style={styles.streakNumber}>
            {streakDays} days
          </ThemedText>
          <ThemedText>
            Completed days are highlighted. Use the month controls to review
            longer streaks.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, gap: 16 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  link: {
    fontWeight: "700",
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    padding: 18,
    gap: 14,
  },
  selectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  monthLabel: {
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  dayCell: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  dayLabel: {
    fontSize: 12,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: "800",
  },
});
