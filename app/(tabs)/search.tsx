import { router } from "expo-router";
import React, { useState } from "react";
import {
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

type FilterKey = "workouts" | "nutrition";

const NEARBY_GYMS = [
  { id: "g1", name: "Downtown Fitness", distance: "0.8 km", rating: 4.6 },
  { id: "g2", name: "Westside Strength", distance: "1.2 km", rating: 4.4 },
  { id: "g3", name: "East Gym", distance: "2.1 km", rating: 4.2 },
];

const buddies = [
  { id: "1", name: "Alex", level: "Intermediate" },
  { id: "2", name: "Jordan", level: "Beginner" },
];

const FILTER_OPTIONS = [
  { id: "workouts", label: "Workouts" },
  { id: "nutrition", label: "Nutrition" },
];

const WORKOUT_RECOMMENDATIONS = [
  {
    id: "w1",
    title: "Strength training",
    details: "Compound lifts, progressive overload, and recovery",
  },
  {
    id: "w2",
    title: "HIIT sessions",
    details: "Intervals, short rest, and high intensity",
  },
];

const NUTRITION_RECOMMENDATIONS = [
  {
    id: "n1",
    title: "Post-workout recovery",
    details: "Protein, carbs, hydration, and meal timing",
  },
  {
    id: "n2",
    title: "Balanced meals",
    details: "Lean protein, fiber, healthy fats, and consistency",
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("workouts");
  const [videoResults, setVideoResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNearbyGyms, setShowNearbyGyms] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const inputBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F1F1F" },
    "background",
  );
  const inputBorderColor = useThemeColor(
    { light: "#D1D5DB", dark: "#4B5563" },
    "icon",
  );
  const inputPlaceholderColor = useThemeColor(
    { light: "#6B7280", dark: "#D1D5DB" },
    "icon",
  );
  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background",
  );
  const buttonBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1F1F1F" },
    "background",
  );
  const buttonBorderColor = useThemeColor(
    { light: "#D1D5DB", dark: "#4B5563" },
    "icon",
  );
  const activeButtonBg = useThemeColor(
    { light: "#DDECF3", dark: "#0A4A5C" },
    "background",
  );
  const activeBorderColor = useThemeColor(
    { light: "#7FB6C8", dark: "#0A9EC8" },
    "tint",
  );
  const primaryButtonBg = useThemeColor(
    { light: "#2563EB", dark: "#3B82F6" },
    "tint",
  );

  const onSearch = async () => {
    if (!query.trim()) {
      setVideoResults([]);
      return;
    }

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

  const handleNearbyGyms = () => {
    setShowNearbyGyms(!showNearbyGyms);
  };

  const openBuddyChat = (buddyId: string, buddyName: string) => {
    router.push(
      `/buddy-chat?name=${encodeURIComponent(buddyName)}&id=${encodeURIComponent(
        buddyId,
      )}`,
    );
  };

  const recommendations =
    activeFilter === "workouts"
      ? WORKOUT_RECOMMENDATIONS
      : NUTRITION_RECOMMENDATIONS;

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor }]}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <ThemedText type="title">Search</ThemedText>

      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: inputBg,
            color: textColor,
            borderColor: inputBorderColor,
          },
        ]}
        placeholder="Search videos, workouts, nutrition or buddies"
        placeholderTextColor={inputPlaceholderColor}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSearch}
        returnKeyType="search"
        blurOnSubmit={false}
        autoCapitalize="none"
        autoCorrect={false}
        selectionColor={activeBorderColor}
        clearButtonMode="while-editing"
        textAlignVertical="center"
      />

      <TouchableOpacity
        style={[styles.nearbyGymsButton, { backgroundColor: primaryButtonBg }]}
        onPress={handleNearbyGyms}
      >
        <ThemedText style={styles.nearbyGymsButtonText}>
          📍 Search Nearby Gyms
        </ThemedText>
      </TouchableOpacity>

      {showNearbyGyms && (
        <ThemedView style={[styles.gymsSection, { backgroundColor: cardBg }]}>
          <ThemedText type="subtitle">Nearby Gyms</ThemedText>
          {NEARBY_GYMS.map((gym) => (
            <TouchableOpacity
              key={gym.id}
              style={[styles.gymCard, { borderColor: inputBorderColor }]}
            >
              <View style={styles.gymHeader}>
                <ThemedText type="defaultSemiBold">{gym.name}</ThemedText>
                <ThemedText style={styles.rating}>⭐ {gym.rating}</ThemedText>
              </View>
              <ThemedText>{gym.distance}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}

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
            onPress={() => setActiveFilter(option.id as FilterKey)}
          >
            <ThemedText
              type={activeFilter === option.id ? "defaultSemiBold" : "default"}
            >
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <ThemedText type="subtitle">Recommended topics</ThemedText>

      {recommendations.map((item) => (
        <ThemedView
          key={item.id}
          style={[styles.recommendationCard, { backgroundColor: cardBg }]}
        >
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
          <ThemedText>{item.details}</ThemedText>
        </ThemedView>
      ))}

      <ThemedText type="subtitle">Video results</ThemedText>

      {loading ? (
        <ThemedText>Searching...</ThemedText>
      ) : videoResults.length === 0 ? (
        <ThemedText>No results</ThemedText>
      ) : (
        videoResults.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.item, { backgroundColor: cardBg }]}
            onPress={() => {}}
          >
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText>{item.channel}</ThemedText>
          </TouchableOpacity>
        ))
      )}

      <ThemedText type="subtitle">Buddies</ThemedText>

      {buddies.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.buddy, { backgroundColor: cardBg }]}
          onPress={() => openBuddyChat(item.id, item.name)}
        >
          <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
          <ThemedText>{item.level}</ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  searchInput: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: 20,
  },
  nearbyGymsButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  nearbyGymsButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  gymsSection: {
    padding: 16,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  gymCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  gymHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    fontWeight: "600",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1.5,
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
