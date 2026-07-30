import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const ongoingWorkout = useWorkoutStore((state) => state.ongoingWorkout);
  const plansByDay = useWorkoutStore((state) => state.plansByDay);
  const stepsByDay = useWorkoutStore((state) => state.stepsByDay);
  const trackingEnabledByDay = useWorkoutStore(
    (state) => state.trackingEnabledByDay,
  );
  const user = useAuthStore((state) => state.user);
  const loginCount = useAuthStore((state) => state.loginCount);

  const cardBg = useThemeColor(
    { light: "#FFFFFFCC", dark: "#2C2C2C" },
    "background",
  );
  const tint = useThemeColor({}, "tint");
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

  const formatDurationDisplay = (minutesDecimal: number) => {
    const totalSec = Math.round(minutesDecimal * 60);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    if (m === 0) return `${s}s`;
    return `${m}:${s.toString().padStart(2, "0")} min`;
  };

  const [, setNowTick] = useState(Date.now());
  useEffect(() => {
    if (!ongoingWorkout) return;
    const id = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, [ongoingWorkout]);

  const ongoingElapsedDisplay = () => {
    if (!ongoingWorkout) return null;
    const elapsedSec = Math.round(
      (Date.now() - new Date(ongoingWorkout.startedAt).getTime()) / 1000,
    );
    return formatDurationDisplay(elapsedSec / 60);
  };

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayPlan = plansByDay[todayKey];
  const todaySteps = stepsByDay[todayKey] ?? 0;
  const todayTrackingEnabled = trackingEnabledByDay[todayKey] ?? true;
  const completedDays = useWorkoutStore((state) => state.completedDays);
  const shouldShowWelcome = loginCount > 2 && !!user;
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "there";

  const getDayKey = (date: Date) => date.toISOString().slice(0, 10);
  const last7Days = Array.from({ length: 7 }).map((_, idx) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - idx));
    const key = getDayKey(day);
    return {
      label: day
        .toLocaleDateString(undefined, { weekday: "short" })
        .slice(0, 3),
      completed: Boolean(completedDays[key]),
    };
  });

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
        <ThemedText type="title" style={styles.heroTitle}>
          FitConnect
        </ThemedText>
        <ThemedText type="subtitle" style={styles.heroSubtitle}>
          Your gym and fitness companion
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.dashboard}>
        <View style={styles.topCardsRow}>
          <Pressable
            onPress={() => router.push("/plan" as never)}
            style={({ pressed }) => [
              styles.largeCard,
              { backgroundColor: tint, opacity: pressed ? 0.95 : 1 },
            ]}
          >
            <ThemedText style={styles.largeCardTitle}>
              {todayPlan ? todayPlan.title : "No plan for today"}
            </ThemedText>
            {todayPlan ? (
              <>
                <ThemedText style={styles.largeCardSubtitle}>
                  {todayPlan.description}
                </ThemedText>
                <ThemedText style={styles.largeCardSubtitle}>
                  {`${todayPlan.durationMinutes} min · ${todayPlan.exercises} exercises`}
                </ThemedText>
              </>
            ) : (
              <ThemedText style={styles.largeCardSubtitle}>
                Tap to create a plan
              </ThemedText>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push("/steps" as never)}
            style={({ pressed }) => [
              styles.largeCard,
              {
                backgroundColor: tint,
                opacity: pressed ? 0.95 : 1,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.24)",
                shadowColor: tint,
                shadowOpacity: 0.16,
                shadowOffset: { width: 0, height: 10 },
                shadowRadius: 22,
                elevation: 8,
              },
            ]}
          >
            <ThemedText style={styles.largeCardTitle}>
              Track your steps
            </ThemedText>
            <ThemedText style={styles.largeCardSubtitle}>
              Tap to view daily step history
            </ThemedText>
            <ThemedText style={styles.largeCardSubtitle}>
              {todayTrackingEnabled
                ? `Today: ${todaySteps} steps`
                : "Step tracking paused for today"}
            </ThemedText>
          </Pressable>
        </View>

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
              <ThemedText type="defaultSemiBold" style={styles.centerText}>
                {metric.value}
              </ThemedText>
              <ThemedText style={styles.metricLabel}>{metric.label}</ThemedText>
            </ThemedView>
          ))}
        </View>
      </ThemedView>
      {/* Today's plan moved into the top card — removed duplicate section */}

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Recent workout</ThemedText>
        <ThemedView
          style={[styles.planCard, { backgroundColor: cardBg, borderColor }]}
        >
          <ThemedText type="defaultSemiBold">
            {ongoingWorkout
              ? `In progress — ${ongoingWorkout.title}`
              : latestWorkout
                ? `Last session — ${latestWorkout.title}`
                : "No workouts yet"}
          </ThemedText>
          <ThemedText>
            {ongoingWorkout
              ? `${ongoingWorkout.exercises} exercises · ${ongoingElapsedDisplay()}`
              : latestWorkout
                ? `${latestWorkout.exercises} exercises · ${formatDurationDisplay(
                    latestWorkout.durationMinutes,
                  )}`
                : "Complete a workout to see it here"}
          </ThemedText>
          <ThemedText>
            {ongoingWorkout
              ? "Keep going — your workout is in progress"
              : latestWorkout
                ? `Completed: ${formatDurationDisplay(
                    latestWorkout.durationMinutes,
                  )} · ${latestWorkout.calories} kcal`
                : "Start your first workout"}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.smallList}>
          {recentWorkouts.length > 0 ? (
            recentWorkouts.map((workout) => (
              <ThemedText key={workout.id}>
                • {workout.title} —{" "}
                {formatDurationDisplay(workout.durationMinutes)}
              </ThemedText>
            ))
          ) : (
            <ThemedText>• No recent workouts yet</ThemedText>
          )}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedView style={[styles.streakCard, { backgroundColor: streakBg }]}>
          <View style={styles.streakHeader}>
            <ThemedText type="subtitle">Streak</ThemedText>
            <Pressable
              onPress={() => router.push("/streaks" as never)}
              style={({ pressed }) => [
                styles.smallLink,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <ThemedText type="defaultSemiBold">View history</ThemedText>
            </Pressable>
          </View>
          <View style={styles.graphRow}>
            {last7Days.map((day) => (
              <View key={day.label} style={styles.graphItem}>
                <View
                  style={[
                    styles.graphDot,
                    day.completed && {
                      backgroundColor: tint,
                      borderColor: tint,
                    },
                  ]}
                />
                <ThemedText style={styles.graphLabel}>{day.label}</ThemedText>
              </View>
            ))}
          </View>
          <ThemedText type="defaultSemiBold" style={styles.streakSummary}>
            Current streak: {streakDays || 0} days
          </ThemedText>
          <ThemedText>
            {streakDays > 0
              ? "Keep it up — your streak is tracked daily."
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
  topCardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  largeCard: {
    flex: 1,
    padding: 22,
    borderRadius: 18,
    minHeight: 120,
    justifyContent: "center",
  },
  largeCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  largeCardSubtitle: {
    color: "#ffffffcc",
    fontSize: 13,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
  },
  heroSubtitle: {
    fontSize: 14,
    opacity: 0.9,
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
  streakHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  smallLink: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  graphRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  graphItem: {
    alignItems: "center",
    gap: 6,
  },
  graphDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    backgroundColor: "transparent",
  },
  graphLabel: {
    fontSize: 10,
    opacity: 0.8,
  },
  streakSummary: {
    marginBottom: 8,
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
