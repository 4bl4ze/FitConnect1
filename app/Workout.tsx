import { useAudioPlayer } from "expo-audio";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { useWorkoutStore } from "@/stores/useWorkoutStore";

type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
};

export default function StartWorkout() {
  const [isRunning, setIsRunning] = useState(false);
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [seconds, setSeconds] = useState(
    durationMinutes * 60 + durationSeconds,
  );

  const [exerciseName, setExerciseName] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const alarmPlayedRef = useRef(false);
  const autoRecordedRef = useRef(false);
  const workoutAlarmPlayer = useAudioPlayer(
    require("../assets/audio/timer-alarm.mp3"),
  );
  const recordWorkout = useWorkoutStore((state) => state.recordWorkout);
  const setOngoingWorkout = useWorkoutStore((state) => state.setOngoingWorkout);

  const screenBg = useThemeColor(
    { light: "#F8FAFC", dark: "#0F172A" },
    "background",
  );
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#111827" },
    "background",
  );
  const surfaceBg = useThemeColor(
    { light: "#F8FAFC", dark: "#1F2937" },
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
  const homeButtonBg = useThemeColor(
    { light: "#EEF2FF", dark: "#1E293B" },
    "background",
  );
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

  const durationTotalSeconds = durationMinutes * 60 + durationSeconds;

  const stopTimerAlarm = useCallback(() => {
    workoutAlarmPlayer.pause();
    workoutAlarmPlayer.seekTo(0);
  }, [workoutAlarmPlayer]);

  const triggerTimerAlarm = useCallback(() => {
    try {
      workoutAlarmPlayer.seekTo(0);
      workoutAlarmPlayer.play();
    } catch (error) {
      console.warn("Could not play workout timer alarm:", error);
    }

    Alert.alert(
      "Workout Complete ⏰",
      "Your workout timer has reached zero.",
      [
        {
          text: "Stop Alarm",
          onPress: () => {
            stopTimerAlarm();
          },
        },
      ],
      { cancelable: false },
    );
  }, [stopTimerAlarm, workoutAlarmPlayer]);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);

          if (!alarmPlayedRef.current) {
            alarmPlayedRef.current = true;
            triggerTimerAlarm();

            // Auto-record the workout when timer naturally reaches zero
            if (!autoRecordedRef.current && exercises.length > 0) {
              autoRecordedRef.current = true;

              const elapsedSeconds = durationTotalSeconds; // full duration reached

              recordWorkout({
                title:
                  exercises.length > 0
                    ? exercises[0].name
                    : "Full body workout",
                durationMinutes: parseFloat((elapsedSeconds / 60).toFixed(2)),
                calories: Math.max(
                  180,
                  exercises.length * 80 + Math.round(elapsedSeconds / 20),
                ),
                exercises: exercises.length,
              });
            }
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, seconds, triggerTimerAlarm]);

  useEffect(() => {
    if (!isRunning) {
      setSeconds(durationTotalSeconds);
    }
  }, [durationTotalSeconds, isRunning]);

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

  const confirmRemoveExercise = (id: string, name?: string) => {
    Alert.alert(
      "Remove Exercise",
      `Remove \"${name ?? "this exercise"}\" from the workout?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeExercise(id),
        },
      ],
    );
  };

  const finishWorkout = () => {
    setIsRunning(false);
    stopTimerAlarm();
    alarmPlayedRef.current = false;

    const elapsedSeconds = Math.max(0, durationTotalSeconds - seconds);

    // If the user finished a workout without adding any exercises, do not
    // record it — leave dashboard totals at zero.
    if (exercises.length === 0) {
      Alert.alert(
        "Workout Complete",
        "No exercises were added — nothing was recorded.",
      );
      router.back();
      return;
    }

    // If the workout was already auto-recorded when the timer reached zero,
    // avoid recording it again.
    if (autoRecordedRef.current) {
      Alert.alert("Workout Complete", "This workout was already recorded.");
      router.back();
      return;
    }

    recordWorkout({
      title: exercises.length > 0 ? exercises[0].name : "Full body workout",
      // store minutes as decimal including seconds (e.g. 0.5 for 30s)
      durationMinutes: parseFloat((elapsedSeconds / 60).toFixed(2)),
      calories: Math.max(
        180,
        exercises.length * 80 + Math.round(elapsedSeconds / 20),
      ),
      exercises: exercises.length,
    });

    Alert.alert(
      "Workout Complete 🎉",
      `Time: ${formatTime(elapsedSeconds)}\nExercises: ${exercises.length}`,
    );

    router.back();
  };

  const removeWorkout = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setExercises([]);
            setIsRunning(false);
            setSeconds(0);
            setOngoingWorkout(null);
            autoRecordedRef.current = false;
          },
        },
      ],
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: screenBg }]}>
      <View style={styles.headerRow}>
        <ThemedText type="title">Start Workout</ThemedText>

        <Pressable
          style={[
            styles.homeButton,
            { backgroundColor: homeButtonBg, borderColor },
          ]}
          onPress={() => router.replace("/(tabs)")}
        >
          <ThemedText
            style={[styles.homeButtonText, { color: timerBorderColor }]}
          >
            🏠 Home
          </ThemedText>
        </Pressable>
      </View>

      <View
        style={[styles.timerCard, { backgroundColor: cardBg, borderColor }]}
      >
        <ThemedText style={styles.durationHint}>
          Tap timer to edit minutes and seconds
        </ThemedText>

        <Pressable
          style={[
            styles.timerDisplay,
            {
              backgroundColor: timerBoxBg,
              borderColor: timerBorderColor,
            },
          ]}
          onPress={() => {
            setIsRunning(false);
            alarmPlayedRef.current = false;
            stopTimerAlarm();
            setIsEditingDuration((prev) => !prev);
            setSeconds(durationTotalSeconds);
          }}
        >
          <ThemedText style={[styles.timer, { color: timerTextColor }]}>
            {formatTime(seconds)}
          </ThemedText>
        </Pressable>

        {isEditingDuration && (
          <View style={styles.durationControlRow}>
            <View
              style={[
                styles.durationControlCard,
                { backgroundColor: surfaceBg, borderColor },
              ]}
            >
              <ThemedText style={styles.durationControlLabel}>
                Minutes
              </ThemedText>
              <View style={styles.durationControlButtons}>
                <Pressable
                  style={styles.controlBtn}
                  onPress={() =>
                    setDurationMinutes((prev) => Math.max(0, prev - 1))
                  }
                >
                  <ThemedText style={styles.blueText}>−</ThemedText>
                </Pressable>
                <ThemedText style={styles.controlValue}>
                  {durationMinutes}
                </ThemedText>
                <Pressable
                  style={styles.controlBtn}
                  onPress={() => setDurationMinutes((prev) => prev + 1)}
                >
                  <ThemedText style={styles.blueText}>+</ThemedText>
                </Pressable>
              </View>
            </View>

            <View
              style={[
                styles.durationControlCard,
                { backgroundColor: surfaceBg, borderColor },
              ]}
            >
              <ThemedText style={styles.durationControlLabel}>
                Seconds
              </ThemedText>
              <View style={styles.durationControlButtons}>
                <Pressable
                  style={styles.controlBtn}
                  onPress={() =>
                    setDurationSeconds((prev) => Math.max(0, prev - 1))
                  }
                >
                  <ThemedText style={styles.blueText}>−</ThemedText>
                </Pressable>
                <ThemedText style={styles.controlValue}>
                  {durationSeconds}
                </ThemedText>
                <Pressable
                  style={styles.controlBtn}
                  onPress={() =>
                    setDurationSeconds((prev) => Math.min(59, prev + 1))
                  }
                >
                  <ThemedText style={styles.blueText}>+</ThemedText>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        <View style={styles.row}>
          <Pressable
            style={styles.blueBtn}
            onPress={() => {
              if (seconds === 0) {
                setSeconds(durationTotalSeconds);
              }
              alarmPlayedRef.current = false;
              stopTimerAlarm();
              autoRecordedRef.current = false;
              setIsRunning(true);
              if (exercises.length > 0) {
                setOngoingWorkout({
                  id: Date.now().toString(),
                  title: exercises[0].name ?? "Workout",
                  startedAt: new Date().toISOString(),
                  exercises: exercises.length,
                });
              }
            }}
          >
            <ThemedText style={styles.whiteText}>Start</ThemedText>
          </Pressable>

          <Pressable
            style={styles.lightBtn}
            onPress={() => {
              setIsRunning(false);
              stopTimerAlarm();
            }}
          >
            <ThemedText style={styles.blueText}>Pause</ThemedText>
          </Pressable>

          <Pressable
            style={styles.redBtn}
            onPress={() => {
              setIsRunning(false);
              alarmPlayedRef.current = false;
              stopTimerAlarm();
              setSeconds(durationTotalSeconds);
              // clear ongoing workout when reset
              setOngoingWorkout(null);
              autoRecordedRef.current = false;
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
          placeholderTextColor={mutedTextColor}
          style={[
            styles.input,
            { backgroundColor: surfaceBg, borderColor, color: textColor },
          ]}
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
          <View
            style={[
              styles.exerciseCard,
              { backgroundColor: cardBg, borderColor },
            ]}
          >
            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>

            <View style={styles.row}>
              <View style={styles.controlGroup}>
                <Pressable
                  style={styles.controlBtn}
                  onPress={() =>
                    updateExercise(item.id, "sets", Math.max(1, item.sets - 1))
                  }
                >
                  <ThemedText style={styles.blueText}>−</ThemedText>
                </Pressable>

                <ThemedText style={styles.controlValue}>{item.sets}</ThemedText>

                <Pressable
                  style={styles.controlBtn}
                  onPress={() => updateExercise(item.id, "sets", item.sets + 1)}
                >
                  <ThemedText style={styles.blueText}>+</ThemedText>
                </Pressable>

                <ThemedText style={{ marginLeft: 8 }}>sets</ThemedText>
              </View>

              <View style={styles.controlGroup}>
                <Pressable
                  style={styles.controlBtn}
                  onPress={() =>
                    updateExercise(item.id, "reps", Math.max(1, item.reps - 1))
                  }
                >
                  <ThemedText style={styles.blueText}>−</ThemedText>
                </Pressable>

                <ThemedText style={styles.controlValue}>{item.reps}</ThemedText>

                <Pressable
                  style={styles.controlBtn}
                  onPress={() => updateExercise(item.id, "reps", item.reps + 1)}
                >
                  <ThemedText style={styles.blueText}>+</ThemedText>
                </Pressable>

                <ThemedText style={{ marginLeft: 8 }}>reps</ThemedText>
              </View>

              <Pressable
                onPress={() => confirmRemoveExercise(item.id, item.name)}
              >
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

      <Pressable style={styles.removeWorkoutBtn} onPress={removeWorkout}>
        <ThemedText style={styles.whiteText}>Delete Workout</ThemedText>
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

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  homeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },

  homeButtonText: {
    color: BLUE,
    fontWeight: "700",
  },

  timerCard: {
    padding: 18,
    borderRadius: 16,
    gap: 10,
    alignItems: "center",
    borderWidth: 1,
  },

  durationHint: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 10,
    textAlign: "center",
  },

  durationRow: {
    width: "100%",
    maxWidth: 280,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 10,
  },

  durationControlCard: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
  },

  durationControlLabel: {
    fontWeight: "600",
  },

  durationControlButtons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },

  durationControlRow: {
    width: "100%",
    maxWidth: 280,
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
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
    padding: 10,
    borderRadius: 10,
  },

  exerciseCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },

  row: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },

  controlGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 8,
  },

  controlBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BLUE,
    backgroundColor: LIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  controlValue: {
    minWidth: 28,
    textAlign: "center",
    fontWeight: "700",
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

  removeWorkoutBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#B91C1C",
    alignItems: "center",
    marginTop: 8,
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
