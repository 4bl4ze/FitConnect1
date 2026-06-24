import React, { useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { searchVideos } from "@/services/videoService";

const buddies = [
  { id: "1", name: "Alex", level: "Intermediate" },
  { id: "2", name: "Jordan", level: "Beginner" },
];

const FILTER_OPTIONS = [
  { id: "workouts", label: "Gym workouts" },
  { id: "nutrition", label: "Nutrition" },
];

const WORKOUT_RECOMMENDATIONS = [
  {
    id: "w1",
    title: "Strength training",
    aspects: ["Compound lifts", "Progressive overload", "Recovery"],
  },
  {
    id: "w2",
    title: "HIIT sessions",
    aspects: ["Intervals", "Bodyweight", "Short rest"],
  },
  {
    id: "w3",
    title: "Mobility work",
    aspects: ["Stretching", "Dynamic warm-up", "Joint health"],
  },
];

const NUTRITION_RECOMMENDATIONS = [
  {
    id: "n1",
    title: "Post-workout recovery",
    aspects: ["Protein shake", "Whole grains", "Veggies"],
  },
  {
    id: "n2",
    title: "Balanced meals",
    aspects: ["Lean protein", "Fiber", "Healthy fats"],
  },
  {
    id: "n3",
    title: "Hydration plan",
    aspects: ["Water", "Electrolytes", "Consistent intake"],
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("workouts");
  const [videoResults, setVideoResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "icon");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background",
  );
  const buttonBg = useThemeColor(
    { light: "#fff", dark: "#1F1F1F" },
    "background",
  );
  const buttonBorderColor = useThemeColor(
    { light: "#D1D5DB", dark: "#444" },
    "icon",
  );
  const activeButtonBg = useThemeColor(
    { light: "#E0F2F7", dark: "#0a4a5c" },
    "background",
  );
  const activeBorderColor = useThemeColor(
    { light: "#7FB6C8", dark: "#0a9ec8" },
    "tint",
  );

  const onSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await searchVideos(query, { maxResults: 10 });
      setVideoResults(res);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.scrollView, { backgroundColor }]} 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <ThemedText type="title">Search</ThemedText>
      <TextInput
        style={[
          styles.search,
          {
            backgroundColor: buttonBg,
            color: textColor,
            borderColor: buttonBorderColor,
          },
        ]}
        placeholder="Search videos, workouts, nutrition or buddies"
        placeholderTextColor={borderColor}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSearch}
      />

      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  activeFilter === option.id ? activeButtonBg : buttonBg,
                borderColor:
                  activeFilter === option.id
                    ? activeBorderColor
                    : buttonBorderColor,
              },
            ]}
            onPress={() => setActiveFilter(option.id)}
          >
            <ThemedText
              type={activeFilter === option.id ? "defaultSemiBold" : "default"}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {activeFilter === "workouts" ? (
        <ThemedView style={styles.recommendationBlock}>
          <ThemedText type="subtitle">Workout recommendations</ThemedText>
          {WORKOUT_RECOMMENDATIONS.map((item) => (
            <ThemedView
              key={item.id}
              style={[styles.recommendationCard, { backgroundColor: cardBg }]}
            >
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText>
                Recommended aspects: {item.aspects.join(", ")}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      ) : (
        <ThemedView style={styles.recommendationBlock}>
          <ThemedText type="subtitle">Nutrition recommendations</ThemedText>
          {NUTRITION_RECOMMENDATIONS.map((item) => (
            <ThemedView
              key={item.id}
              style={[styles.recommendationCard, { backgroundColor: cardBg }]}
            >
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText>
                Recommended aspects: {item.aspects.join(", ")}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      <ThemedText type="subtitle">Video Results</ThemedText>
      <FlatList
        data={videoResults}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, { backgroundColor: cardBg }]}
            onPress={() => {}}
          >
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText>{item.channel}</ThemedText>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <ThemedText>{loading ? "Searching..." : "No results"}</ThemedText>
        }
        scrollEnabled={false}
      />

      <ThemedText type="subtitle">Buddies</ThemedText>
      <FlatList
        data={buddies}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={[styles.buddy, { backgroundColor: cardBg }]}>
            <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
            <ThemedText>{item.level}</ThemedText>
          </View>
        )}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  ScrollView:{
    flex:1,
  },
  container: { 
    padding: 20, 
    gap: 16, 
    paddingBottom: 40 },
  search: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  filterButtonActive: {
    // handled dynamically in component
  },
  recommendationBlock: {
    gap: 12,
    paddingVertical: 12,
  },
  recommendationCard: {
    padding: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  item: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  buddy: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
});
