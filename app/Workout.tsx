import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
};

export default function StartWorkout() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const [exerciseName, setExerciseName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const timerTextColor = useThemeColor(
    { light: "#0F172A", dark: "#F9FAFB" },
    "text",
  );
  const timerBoxBg = useThemeColor(
    { light: "#FFFFFF", dark: "#111827" },
    "background",
  );
  const timerBorderColor = useThemeColor(
    { light: "#2563EB", dark: "#60A5FA" },
    "tint",
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const addExercise = () => {
    if (!exerciseName.trim()) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: 3,
      reps: 10,
    };

    setExercises((prev) => [...prev, newExercise]);
    setExerciseName("");
  };

  const updateExercise = (id: string, field: keyof Exercise, value: number) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex)),
    );
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const finishWorkout = () => {
    setIsRunning(false);

    Alert.alert(
      "Workout Complete 🎉",
      `Time: ${formatTime(seconds)}\nExercises: ${exercises.length}`,
    );

    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Start Workout</ThemedText>

        <Pressable
          style={styles.homeButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <ThemedText style={styles.homeButtonText}>🏠 Home</ThemedText>
        </Pressable>
      </View>

      <View style={styles.timerCard}>
        <ThemedText type="subtitle">Timer</ThemedText>

        <View
          style={[
            styles.timerDisplay,
            {
              backgroundColor: timerBoxBg,
              borderColor: timerBorderColor,
            },
          ]}
        >
          <ThemedText style={[styles.timer, { color: timerTextColor }]}>
            {formatTime(seconds)}
          </ThemedText>
        </View>

        <View style={styles.row}>
          <Pressable style={styles.blueBtn} onPress={() => setIsRunning(true)}>
            <ThemedText style={styles.whiteText}>Start</ThemedText>
          </Pressable>

          <Pressable
            style={styles.lightBtn}
            onPress={() => setIsRunning(false)}
          >
            <ThemedText style={styles.blueText}>Pause</ThemedText>
          </Pressable>

          <Pressable
            style={styles.redBtn}
            onPress={() => {
              setIsRunning(false);
              setSeconds(0);
            }}
          >
            <ThemedText style={styles.whiteText}>Reset</ThemedText>
          </Pressable>
        </View>
      </View>

      <View style={styles.addBox}>
        <TextInput
          value={exerciseName}
          onChangeText={setExerciseName}
          placeholder="Add exercise (e.g. Bench Press)"
          style={styles.input}
        />

        <Pressable style={styles.blueBtn} onPress={addExercise}>
          <ThemedText style={styles.whiteText}>Add</ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <View style={styles.exerciseCard}>
            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>

            <View style={styles.row}>
              <Pressable
                onPress={() => updateExercise(item.id, "sets", item.sets + 1)}
              >
                <ThemedText style={styles.blueText}>+ Set</ThemedText>
              </Pressable>

              <Pressable
                onPress={() => updateExercise(item.id, "reps", item.reps + 1)}
              >
                <ThemedText style={styles.blueText}>+ Rep</ThemedText>
              </Pressable>

              <Pressable onPress={() => removeExercise(item.id)}>
                <ThemedText style={styles.redText}>Remove</ThemedText>
              </Pressable>
            </View>

            <ThemedText>
              {item.sets} sets × {item.reps} reps
            </ThemedText>
          </View>
        )}
      />

      <Pressable style={styles.blueBtn} onPress={finishWorkout}>
        <ThemedText style={styles.whiteText}>Finish Workout</ThemedText>
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
    backgroundColor: "#fff",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  homeButton: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: LIGHT,
  },

  homeButtonText: {
    color: BLUE,
    fontWeight: "700",
  },

  timerCard: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: LIGHT,
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: BLUE,
  },

  timerDisplay: {
    width: "100%",
    maxWidth: 280,
    minHeight: 110,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  timer: {
    fontSize: 68,
    fontWeight: "900",
    letterSpacing: 2,
    textAlign: "center",
    lineHeight: 72,
  },

  addBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: BLUE,
    padding: 10,
    borderRadius: 10,
  },

  exerciseCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: LIGHT,
    gap: 6,
  },

  row: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },

  blueBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: BLUE,
    alignItems: "center",
  },

  lightBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: LIGHT,
    alignItems: "center",
  },

  redBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#EF4444",
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

  redText: {
    color: "#EF4444",
    fontWeight: "600",
  },
});
