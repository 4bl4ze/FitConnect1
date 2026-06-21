import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native";
import { router } from "expo-router";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";

const metrics = [
  { label: "Total workouts", value: "18" },
  { label: "Calories burned", value: "5.2k" },
  { label: "Streak", value: "12d" },
];

export default function Dashboard() {
  const cardBg = useThemeColor(
    { light: "#FFFFFFCC", dark: "#2C2C2C" },
    "background",
  );
  const metricBg = useThemeColor(
    { light: "#F3F4F6", dark: "#1F1F1F" },
    "background",
  );
  const streakBg = useThemeColor(
    { light: "#FFF9ED", dark: "#3D3520" },
    "background",
  );
  const actionBg = useThemeColor(
    { light: "#E6F4F8", dark: "#0a4a5c" },
    "background",
  );
  const borderColor = useThemeColor({ light: "#E5E7EB", dark: "#444" }, "icon");

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={280}
          color="#ffffff"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">FitConnect</ThemedText>
        <ThemedText type="subtitle">Your all-in-one gym companion</ThemedText>
      </ThemedView>
      <ThemedView style={styles.dashboard}>
        <ThemedView
          style={[styles.card, { backgroundColor: cardBg, borderColor }]}
        >
          <ThemedText type="subtitle">Welcome back</ThemedText>
          <ThemedText type="defaultSemiBold">Demo User</ThemedText>
        </ThemedView>
        <View style={styles.metricRow}>
          {metrics.map((metric) => (
            <ThemedView
              key={metric.label}
              style={[styles.metricCard, { backgroundColor: metricBg }]}
            >
              <ThemedText type="defaultSemiBold">{metric.value}</ThemedText>
              <ThemedText>{metric.label}</ThemedText>
            </ThemedView>
          ))}
        </View>
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Today’s plan</ThemedText>
        <ThemedView
          style={[styles.planCard, { backgroundColor: cardBg, borderColor }]}
        >
          <ThemedText type="defaultSemiBold">Upper body strength</ThemedText>
          <ThemedText>Chest, shoulders, and triceps</ThemedText>
          <ThemedText>45 min · 6 exercises</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Recent workout</ThemedText>
        <ThemedView
          style={[styles.planCard, { backgroundColor: cardBg, borderColor }]}
        >
          <ThemedText type="defaultSemiBold">
            Last session — Push day
          </ThemedText>
          <ThemedText>Bench press, incline press, triceps dips</ThemedText>
          <ThemedText>Completed: 60 min · 520 kcal</ThemedText>
        </ThemedView>
        <ThemedView style={styles.smallList}>
          <ThemedText>• Squat — 3x5</ThemedText>
          <ThemedText>• Deadlift — 1x5</ThemedText>
          <ThemedText>• Pull-ups — 4x8</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Streak & Progress</ThemedText>
        <ThemedView style={[styles.streakCard, { backgroundColor: streakBg }]}>
          <ThemedText type="defaultSemiBold">
            Current streak: 12 days
          </ThemedText>
          <ThemedText>Keep it up — you are doing great.</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Quick Actions</ThemedText>
        <View style={styles.actionsRow}>
         <Pressable
  style={[styles.actionBtn, { backgroundColor: actionBg }]}
  onPress={() => router.push("/Workout")}
>
  <ThemedText type="defaultSemiBold">
    Start Workout
  </ThemedText>
</Pressable>
  <Pressable
  style={[styles.actionBtn, { backgroundColor: actionBg }]}
  onPress={() => router.push("/AI")}
>
  <ThemedText type="defaultSemiBold">
    AI Trainer
  </ThemedText>
</Pressable>
          <Pressable
  style={[styles.actionBtn, { backgroundColor: actionBg }]}
  onPress={() => router.push("/bookTrainer")}
>
  <ThemedText type="defaultSemiBold">
    Book Trainer
  </ThemedText>
</Pressable>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 12,
    marginBottom: 8,
  },
  dashboard: {
    gap: 20,
    marginBottom: 12,
  },
  card: {
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
  },
  metricCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  section: {
    gap: 14,
    marginBottom: 8,
  },
  planCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
  smallList: {
    gap: 8,
    paddingLeft: 8,
    paddingRight: 8,
  },
  streakCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  headerImage: {
    position: "absolute",
    top: 24,
    left: 12,
    opacity: 0.08,
  },
});
