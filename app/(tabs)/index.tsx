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
  {/* Added style={styles.centerText} */}
  <ThemedText type="defaultSemiBold" style={styles.centerText}>
    {metric.value}
  </ThemedText>
  
  {/* Added style={styles.metricLabel} */}
  <ThemedText style={styles.metricLabel}>
    {metric.label}
  </ThemedText>
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
    position: "absolute",
    top: 24,
    left: 12,
    opacity: 0.08,
  },
});
