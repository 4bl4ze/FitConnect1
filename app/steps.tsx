// import { router } from "expo-router";
// import { Pedometer } from "expo-sensors";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";

// import { ThemedText } from "@/components/themed-text";
// import { ThemedView } from "@/components/themed-view";
// import { Colors } from "@/constants/theme";
// import { useThemeColor } from "@/hooks/use-theme-color";
// import { useWorkoutStore } from "@/stores/useWorkoutStore";

// const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// export default function StepsScreen() {
//   const stepsByDay = useWorkoutStore((state) => state.stepsByDay);
//   const trackingEnabledByDay = useWorkoutStore(
//     (state) => state.trackingEnabledByDay,
//   );
//   const setTrackingEnabledForDay = useWorkoutStore(
//     (state) => state.setTrackingEnabledForDay,
//   );
//   const setDailySteps = useWorkoutStore((state) => state.setDailySteps);

//   const tint = useThemeColor({}, "tint");
//   const cardBackground = useThemeColor(
//     { light: "#E6F8FF", dark: "#0F172A" },
//     "background",
//   );
//   const cardBorderColor = useThemeColor(
//     { light: "rgba(10,126,164,0.18)", dark: "rgba(10,126,164,0.35)" },
//     "icon",
//   );
//   const textColor = useThemeColor({}, "text");
//   const metaColor = useThemeColor(
//     { light: Colors.light.icon, dark: Colors.dark.icon },
//     "icon",
//   );
//   const today = useMemo(() => new Date(), []);
//   const todayKey = today.toISOString().slice(0, 10);
//   const [, setSensorAvailable] = useState<boolean | null>(null);
//   const [, setPermissionError] = useState<string | null>(null);

//   const weekDays = useMemo(
//     () =>
//       Array.from({ length: 7 }).map((_, idx) => {
//         const date = new Date(today);
//         date.setDate(today.getDate() - (6 - idx));
//         const key = date.toISOString().slice(0, 10);
//         return {
//           key,
//           label: weekdayNames[date.getDay()],
//           display: date.toLocaleDateString(undefined, {
//             month: "short",
//             day: "numeric",
//           }),
//           date,
//         };
//       }),
//     [today],
//   );

//   const dates = useMemo(
//     () =>
//       weekDays.map((item) => ({
//         ...item,
//         steps: stepsByDay[item.key] ?? 0,
//         enabled: trackingEnabledByDay[item.key] ?? true,
//       })),
//     [weekDays, stepsByDay, trackingEnabledByDay],
//   );

//   const totalSteps = dates.reduce((sum, item) => sum + item.steps, 0);

//   useEffect(() => {
//     let mounted = true;
//     let intervalId: ReturnType<typeof setInterval> | null = null;

//     const loadDailySteps = async () => {
//       try {
//         const available = await Pedometer.isAvailableAsync();
//         if (!mounted) return;
//         setSensorAvailable(available);

//         await Promise.all(
//           dates.map(async (item) => {
//             const start = new Date(item.date);
//             start.setHours(0, 0, 0, 0);
//             const end = new Date(item.date);
//             end.setHours(23, 59, 59, 999);
//             const result = await Pedometer.getStepCountAsync(start, end);
//             if (!mounted) return;
//             setDailySteps(item.key, result.steps);
//           }),
//         );

//         if (available) {
//           const updateToday = async () => {
//             try {
//               const start = new Date(today);
//               start.setHours(0, 0, 0, 0);
//               const end = new Date(today);
//               end.setHours(23, 59, 59, 999);
//               const result = await Pedometer.getStepCountAsync(start, end);
//               if (!mounted) return;
//               if (trackingEnabledByDay[todayKey] ?? true) {
//                 setDailySteps(todayKey, result.steps);
//               }
//             } catch {
//               // ignore polling failures
//             }
//           };

//           await updateToday();
//           intervalId = setInterval(updateToday, 5000);
//         }
//       } catch (error: unknown) {
//         setPermissionError(
//           error instanceof Error ? error.message : "Unable to access step data",
//         );
//       }
//     };

//     loadDailySteps();

//     return () => {
//       mounted = false;
//       if (intervalId !== null) {
//         clearInterval(intervalId);
//       }
//     };
//   }, [dates, setDailySteps, todayKey, trackingEnabledByDay, today]);

//   return (
//     <ThemedView
//       style={[
//         styles.container,
//         { backgroundColor: useThemeColor({}, "background") },
//       ]}
//     >
//       <ScrollView contentContainerStyle={styles.scroll}>
//         <View style={styles.topRow}>
//           <ThemedText type="title">Step Tracker</ThemedText>
//           <Pressable onPress={() => router.back()} style={styles.topAction}>
//             <ThemedText type="defaultSemiBold" style={styles.topActionText}>
//               Close
//             </ThemedText>
//           </Pressable>
//         </View>

//         <ThemedView
//           style={[
//             styles.summaryCard,
//             {
//               backgroundColor: tint,
//             },
//           ]}
//         >
//           <ThemedText type="subtitle" style={styles.summaryTitle}>
//             Last 7 days
//           </ThemedText>
//           <ThemedText type="defaultSemiBold" style={styles.summaryValueLight}>
//             {totalSteps.toLocaleString()} steps
//           </ThemedText>
//           <ThemedText style={styles.summaryTextLight}>
//             Toggle tracking for each day below. If tracking is off, steps for
//             that day will be ignored.
//           </ThemedText>
//         </ThemedView>

//         <ThemedView
//           style={[
//             styles.card,
//             {
//               backgroundColor: cardBackground,
//               borderColor: cardBorderColor,
//               borderWidth: 1,
//             },
//           ]}
//         >
//           {dates.map((item) => (
//             <View key={item.key} style={styles.dateRow}>
//               <View style={styles.dateInfo}>
//                 <ThemedText type="defaultSemiBold">{item.label}</ThemedText>
//                 <ThemedText style={[styles.dateMeta, { color: metaColor }]}>
//                   {item.display}
//                 </ThemedText>
//               </View>
//               <View style={styles.rightGroup}>
//                 <ThemedText style={[styles.stepsValue, { color: textColor }]}>
//                   {item.enabled ? item.steps.toLocaleString() : "Paused"}
//                 </ThemedText>
//                 <Switch
//                   value={item.enabled}
//                   onValueChange={(value) =>
//                     setTrackingEnabledForDay(item.key, value)
//                   }
//                   trackColor={{
//                     false: "#E5E7EB",
//                     true: useThemeColor({}, "tint"),
//                   }}
//                   thumbColor={item.enabled ? "#fff" : "#fff"}
//                 />
//               </View>
//             </View>
//           ))}
//         </ThemedView>
//       </ScrollView>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scroll: {
//     padding: 20,
//     gap: 16,
//   },
//   topRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   topAction: {
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 999,
//     backgroundColor: Colors.light.tint,
//   },
//   topActionText: {
//     color: Colors.light.background,
//   },
//   summaryCard: {
//     borderRadius: 20,
//     padding: 20,
//     gap: 10,
//     shadowColor: "#0a7ea4",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.12,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   summaryTitle: {
//     color: Colors.light.background,
//   },
//   summaryValueLight: {
//     fontSize: 28,
//     marginTop: 4,
//     color: Colors.light.background,
//   },
//   summaryTextLight: {
//     color: Colors.light.background,
//     opacity: 0.95,
//   },
//   card: {
//     borderRadius: 20,
//     padding: 16,
//     gap: 12,
//   },
//   dateRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.06)",
//   },
//   dateInfo: {
//     gap: 4,
//   },
//   dateMeta: {
//     fontSize: 12,
//     color: Colors.light.icon,
//   },
//   rightGroup: {
//     alignItems: "flex-end",
//     gap: 8,
//   },
//   stepsValue: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: Colors.light.text,
//   },
// });
