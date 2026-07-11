import { router } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkoutStore } from "@/stores/useWorkoutStore";

export default function Dashboard() {
  const totalWorkouts = useWorkoutStore((state) => state.totalWorkouts);
  const streakDays = useWorkoutStore((state) => state.streakDays);
  const latestWorkout = useWorkoutStore((state) => state.latestWorkout);
  const recentWorkouts = useWorkoutStore((state) => state.recentWorkouts);
  const plansByDay = useWorkoutStore((state) => state.plansByDay);
  const user = useAuthStore((state) => state.user);
  const loginCount = useAuthStore((state) => state.loginCount);

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

  const metrics = [
    { label: "Total workouts", value: `${totalWorkouts || 0}` },
    {
      label: "Calories burned",
      value: latestWorkout ? `${latestWorkout.calories}` : "0",
    },
    { label: "Streak", value: `${streakDays || 0}d` },
  ];

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayPlan = plansByDay[todayKey];
  const shouldShowWelcome = loginCount > 2 && !!user;
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/icon.png")}
          style={styles.headerImage}
          resizeMode="cover"
        />
      }
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">FitConnect</ThemedText>
        <ThemedText type="subtitle">Your all-in-one gym companion</ThemedText>
      </ThemedView>
      <ThemedView style={styles.dashboard}>
        {shouldShowWelcome && (
          <ThemedView
            style={[styles.card, { backgroundColor: cardBg, borderColor }]}
          >
            <ThemedText type="subtitle">Welcome back, {displayName}</ThemedText>
            <ThemedText type="defaultSemiBold">
              You’re doing great — keep pushing.
            </ThemedText>
          </ThemedView>
        )}
        <View style={styles.metricRow}>
          {metrics.map((metric) => (
            <ThemedView
              key={metric.label}
              style={[styles.metricCard, { backgroundColor: metricBg }]}
            >
              {/* Added style={styles.centerText} */}
              <ThemedText type="defaultSemiBold" style={styles.centerText}>
                {metric.value}
              </ThemedText>

              {/* Added style={styles.metricLabel} */}
              <ThemedText style={styles.metricLabel}>{metric.label}</ThemedText>
            </ThemedView>
          ))}
        </View>
      </ThemedView>
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Today’s plan</ThemedText>
        <ThemedView
          style={[styles.planCard, { backgroundColor: cardBg, borderColor }]}
        >
          <ThemedText type="defaultSemiBold">
            {todayPlan ? todayPlan.title : "No plan for today yet"}
          </ThemedText>
          <ThemedText>
            {todayPlan
              ? todayPlan.description
              : "Add a plan for today to see it here"}
          </ThemedText>
          <ThemedText>
            {todayPlan
              ? `${todayPlan.durationMinutes} min · ${todayPlan.exercises} exercises`
              : "Tap below to create one"}
          </ThemedText>
        </ThemedView>
        <Pressable
          style={[
            styles.actionBtn,
            { backgroundColor: actionBg, width: "100%" },
          ]}
          onPress={() => router.push("/plan" as never)}
        >
          <ThemedText type="defaultSemiBold" style={styles.centerText}>
            {todayPlan ? "Edit today’s plan" : "Create today’s plan"}
          </ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Recent workout</ThemedText>
        <ThemedView
          style={[styles.planCard, { backgroundColor: cardBg, borderColor }]}
        >
          <ThemedText type="defaultSemiBold">
            {latestWorkout
              ? `Last session — ${latestWorkout.title}`
              : "No workouts yet"}
          </ThemedText>
          <ThemedText>
            {latestWorkout
              ? `${latestWorkout.exercises} exercises · ${latestWorkout.durationMinutes} min`
              : "Complete a workout to see it here"}
          </ThemedText>
          <ThemedText>
            {latestWorkout
              ? `Completed: ${latestWorkout.durationMinutes} min · ${latestWorkout.calories} kcal`
              : "Start your first workout"}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.smallList}>
          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout) => (
              <ThemedText key={workout.id}>
                • {workout.title} — {workout.durationMinutes} min
              </ThemedText>
            ))
          ) : (
            <ThemedText>• No recent workouts yet</ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Streak & Progress</ThemedText>
        <ThemedView style={[styles.streakCard, { backgroundColor: streakBg }]}>
          <ThemedText type="defaultSemiBold">
            Current streak: {streakDays || 0} days
          </ThemedText>
          <ThemedText>
            {streakDays > 0
              ? "Keep it up — you are doing great."
              : "Complete a workout today to start your streak."}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Quick Actions</ThemedText>

        <View style={styles.actionsGrid}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: actionBg }]}
            onPress={() => router.push("/Workout")}
          >
            <ThemedText type="defaultSemiBold" style={styles.centerText}>
              Start Workout
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, { backgroundColor: actionBg }]}
            onPress={() => router.push("/AI")}
          >
            <ThemedText type="defaultSemiBold" style={styles.centerText}>
              AI Trainer
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, { backgroundColor: actionBg }]}
            onPress={() => router.push("/bookTrainer")}
          >
            <ThemedText type="defaultSemiBold" style={styles.centerText}>
              Book Trainer
            </ThemedText>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, { backgroundColor: actionBg }]}
            onPress={() => router.push("/friends")}
          >
            <ThemedText type="defaultSemiBold" style={styles.centerText}>
              Friend requests
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
    gap: 10,
  },
  metricCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 6,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  metricLabel: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 4,
    opacity: 0.8,
  },
  centerText: {
    textAlign: "center",
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
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 6,
  },

  actionBtn: {
    width: "48%",
    flexGrow: 1,
    paddingVertical: 18,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.95,
  },
});
