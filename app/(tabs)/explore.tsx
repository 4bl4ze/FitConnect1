import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

const GYMS = [
  {
    id: "g1",
    name: "Downtown Fitness",
    rating: 4.6,
    distance: "0.8 km",
    address: "123 Main St",
    workoutTypes: ["Strength", "HIIT"],
    features: ["Free weights", "Sauna", "Personal training"],
  },
  {
    id: "g2",
    name: "Westside Strength",
    rating: 4.4,
    distance: "1.2 km",
    address: "45 West Ave",
    workoutTypes: ["Powerlifting", "CrossFit"],
    features: ["Olympic platforms", "Nutrition coaching"],
  },
  {
    id: "g3",
    name: "East Gym",
    rating: 4.2,
    distance: "2.1 km",
    address: "78 East Rd",
    workoutTypes: ["Cardio", "Functional training"],
    features: ["Recovery zone", "Group classes"],
  },
];

const NUTRITION_TOPICS = [
  {
    id: "n1",
    title: "Protein-rich meals",
    recommendation: "Aim for lean animal or plant protein with every meal.",
    aspects: ["Chicken", "Tofu", "Greek yogurt"],
  },
  {
    id: "n2",
    title: "Balanced carb timing",
    recommendation:
      "Fuel workouts with complex carbs and recover with veggies.",
    aspects: ["Sweet potatoes", "Quinoa", "Whole grains"],
  },
  {
    id: "n3",
    title: "Hydration strategy",
    recommendation:
      "Drink water consistently and add electrolytes for long sessions.",
    aspects: ["Water", "Coconut water", "Low-sugar sports drinks"],
  },
];

const FILTER_OPTIONS = [
  { id: "gyms", label: "Gym workouts" },
  { id: "nutrition", label: "Nutrition" },
];

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = React.useState("gyms");
  const buttonBg = useThemeColor(
    { light: "#fff", dark: "#1F1F1F" },
    "background",
  );
  const buttonBorderColor = useThemeColor(
    { light: "#D1D5DB", dark: "#444" },
    "icon",
  );
  const activeButtonBg = useThemeColor(
    { light: "#D0E8F0", dark: "#0a4a5c" },
    "background",
  );
  const activeBorderColor = useThemeColor(
    { light: "#7FB6C8", dark: "#0a9ec8" },
    "tint",
  );
  const cardBg = useThemeColor(
    { light: "#F9FAFB", dark: "#2C2C2C" },
    "background",
  );

  const renderFilterButton = (filter: { id: string; label: string }) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterButton,
        {
          backgroundColor:
            activeFilter === filter.id ? activeButtonBg : buttonBg,
          borderColor:
            activeFilter === filter.id ? activeBorderColor : buttonBorderColor,
        },
      ]}
      onPress={() => setActiveFilter(filter.id)}
    >
      <ThemedText
        type={activeFilter === filter.id ? "defaultSemiBold" : "default"}
      >
        {filter.label}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0E8F0", dark: "#12343A" }}
      headerImage={<View style={styles.headerImagePlaceholder} />}
    >
      <ThemedView style={styles.container}>
        <ThemedText type="title">Explore</ThemedText>
        <ThemedText>
          Discover gyms, workout types, and nutrition guidance.
        </ThemedText>

        <View style={styles.filterRow}>
          {FILTER_OPTIONS.map(renderFilterButton)}
        </View>

        {activeFilter === "gyms" ? (
          <>
            <ThemedText type="subtitle">Workout-focused gyms</ThemedText>
            <FlatList
              data={GYMS}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <ThemedView
                  style={[styles.gymCard, { backgroundColor: cardBg }]}
                >
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  <ThemedText>
                    {item.address} · {item.distance}
                  </ThemedText>
                  <ThemedText>⭐ {item.rating}</ThemedText>
                  <ThemedText type="defaultSemiBold">Workout types</ThemedText>
                  <ThemedText>{item.workoutTypes.join(", ")}</ThemedText>
                  <ThemedText type="defaultSemiBold">
                    Recommended features
                  </ThemedText>
                  <ThemedText>{item.features.join(", ")}</ThemedText>
                  <ExternalLink
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`}
                  >
                    <ThemedText type="link">Open in Maps</ThemedText>
                  </ExternalLink>
                </ThemedView>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          </>
        ) : (
          <>
            <ThemedText type="subtitle">Nutrition recommendations</ThemedText>
            <FlatList
              data={NUTRITION_TOPICS}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <ThemedView
                  style={[styles.gymCard, { backgroundColor: cardBg }]}
                >
                  <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                  <ThemedText>{item.recommendation}</ThemedText>
                  <ThemedText type="defaultSemiBold">
                    Recommended aspects
                  </ThemedText>
                  <ThemedText>{item.aspects.join(", ")}</ThemedText>
                </ThemedView>
              )}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          </>
        )}

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">More</ThemedText>
          <ExternalLink href="https://www.youtube.com/results?search_query=gym+tour">
            <ThemedText type="link">Explore Gym Tours & Videos</ThemedText>
          </ExternalLink>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 16, paddingBottom: 40 },
  headerImagePlaceholder: {
    height: 220,
    backgroundColor: "#BFDDE9",
    opacity: 0.5,
    borderRadius: 12,
    marginLeft: 12,
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
  mapPlaceholder: {
    height: 160,
    borderRadius: 16,
    backgroundColor: "#E6F4F8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  gymCard: {
    padding: 18,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  section: {
    marginTop: 16,
  },
});
