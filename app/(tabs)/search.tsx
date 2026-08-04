import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  getRecommendations,
  searchVideos,
  VideoResult,
} from "@/services/videoService";

type CategoryFilter =
  | "all"
  | "workouts"
  | "nutrition"
  | "warmup"
  | "buddies"
  | "gyms";

const CATEGORIES: {
  id: CategoryFilter;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { id: "all", label: "All", icon: "sparkles-outline" },
  { id: "workouts", label: "Workouts", icon: "barbell-outline" },
  { id: "nutrition", label: "Nutrition", icon: "nutrition-outline" },
  { id: "warmup", label: "Warmup", icon: "flame-outline" },
  { id: "buddies", label: "Buddies", icon: "people-outline" },
  { id: "gyms", label: "Gyms", icon: "location-outline" },
];

const NEARBY_GYMS = [
  {
    id: "g1",
    name: "Downtown Fitness Center",
    address: "123 Main St • Open 24/7",
    distance: "0.8 km",
    rating: 4.6,
    mapQuery: "Downtown+Fitness",
  },
  {
    id: "g2",
    name: "Westside Strength Club",
    address: "45 West Ave • Open until 10 PM",
    distance: "1.2 km",
    rating: 4.4,
    mapQuery: "Westside+Strength+Club",
  },
  {
    id: "g3",
    name: "East Gym & Spa",
    address: "88 East Blvd • Pool & Sauna",
    distance: "2.1 km",
    rating: 4.2,
    mapQuery: "East+Gym+Spa",
  },
];

const BUDDIES_AND_TRAINERS = [
  {
    id: "b1",
    name: "Alex Chen",
    email: "alex@example.com",
    role: "Buddy",
    level: "Intermediate • Weightlifting",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "b2",
    name: "Jordan Smith",
    email: "jordan@example.com",
    role: "Buddy",
    level: "Beginner • HIIT & Running",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "t1",
    name: "Coach Marcus",
    email: "marcus@example.com",
    role: "Trainer",
    level: "Certified Trainer • Hypertrophy",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  },
];

const RECOMMENDATION_TOPICS = [
  {
    id: "t1",
    title: "Strength & Power Lifting",
    category: "workouts",
    details: "Compound lifts, progressive overload, and rest strategies.",
    icon: "barbell-outline" as const,
  },
  {
    id: "t2",
    title: "HIIT & Cardio Conditioning",
    category: "workouts",
    details: "High-intensity intervals for maximum stamina & fat burn.",
    icon: "flash-outline" as const,
  },
  {
    id: "t3",
    title: "Post-Workout Meal & Hydration",
    category: "nutrition",
    details: "Optimal protein-to-carb ratios and electrolyte replenishment.",
    icon: "restaurant-outline" as const,
  },
  {
    id: "t4",
    title: "Dynamic Warmup Routine",
    category: "warmup",
    details: "Joint mobility exercises to prevent injury and prime muscles.",
    icon: "flame-outline" as const,
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [recommendedVideos, setRecommendedVideos] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNearbyGyms, setShowNearbyGyms] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const inputBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1E293B" },
    "background",
  );
  const inputBorderColor = useThemeColor(
    { light: "#E2E8F0", dark: "#334155" },
    "icon",
  );
  const inputPlaceholderColor = useThemeColor(
    { light: "#64748B", dark: "#94A3B8" },
    "icon",
  );
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1E293B" },
    "background",
  );
  const cardBorderColor = useThemeColor(
    { light: "#E2E8F0", dark: "#334155" },
    "icon",
  );
  const chipBg = useThemeColor(
    { light: "#F1F5F9", dark: "#334155" },
    "background",
  );
  const activeChipBg = useThemeColor(
    { light: "#2563EB", dark: "#3B82F6" },
    "tint",
  );
  const primaryButtonBg = useThemeColor(
    { light: "#2563EB", dark: "#3B82F6" },
    "tint",
  );

  useEffect(() => {
    let isMounted = true;
    const fetchVideos = async () => {
      setLoading(true);
      try {
        let results: VideoResult[] = [];
        if (query.trim()) {
          results = await searchVideos(query, activeCategory);
        } else {
          results = await getRecommendations(activeCategory);
        }
        if (isMounted) {
          setRecommendedVideos(results);
        }
      } catch (err) {
        console.warn("Failed to fetch recommended videos:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVideos();
    return () => {
      isMounted = false;
    };
  }, [activeCategory, query]);

  const handleOpenVideo = (video: VideoResult) => {
    if (video.videoUrl) {
      Linking.openURL(video.videoUrl).catch(() => {
        Alert.alert("Video Link", `Opening video: ${video.title}`);
      });
    } else {
      Alert.alert("Video", video.title);
    }
  };

  const handleOpenMap = (mapQuery: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${mapQuery}`,
      android: `geo:0,0?q=${mapQuery}`,
      default: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    });
    Linking.openURL(url).catch(() => {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
      );
    });
  };

  const openBuddyChat = (buddy: (typeof BUDDIES_AND_TRAINERS)[0]) => {
    router.push(
      `/buddy-chat?name=${encodeURIComponent(
        buddy.name,
      )}&email=${encodeURIComponent(buddy.email)}`,
    );
  };

  const filteredTopics = useMemo(() => {
    if (activeCategory === "all") return RECOMMENDATION_TOPICS;
    return RECOMMENDATION_TOPICS.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  const filteredBuddies = useMemo(() => {
    if (!query.trim()) return BUDDIES_AND_TRAINERS;
    const q = query.toLowerCase();
    return BUDDIES_AND_TRAINERS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.level.toLowerCase().includes(q) ||
        b.role.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor }]}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Discover & Search
          </ThemedText>
          <ThemedText style={{ color: inputPlaceholderColor, fontSize: 13 }}>
            Find workout videos, nutrition tips, gyms, and buddies
          </ThemedText>
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchBarRow}>
          <Ionicons
            name="search"
            size={20}
            color={inputPlaceholderColor}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: inputBg,
                color: textColor,
                borderColor: inputBorderColor,
              },
            ]}
            placeholder="Search videos, workouts, nutrition..."
            placeholderTextColor={inputPlaceholderColor}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query ? (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => setQuery("")}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={inputPlaceholderColor}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Category Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isActive ? activeChipBg : chipBg,
                    borderColor: isActive ? activeChipBg : cardBorderColor,
                  },
                ]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <Ionicons
                  name={cat.icon}
                  size={16}
                  color={isActive ? "#FFFFFF" : textColor}
                />
                <ThemedText
                  style={[
                    styles.categoryChipText,
                    { color: isActive ? "#FFFFFF" : textColor },
                  ]}
                >
                  {cat.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Recommended Videos Section */}
        {(activeCategory === "all" ||
          activeCategory === "workouts" ||
          activeCategory === "nutrition" ||
          activeCategory === "warmup") && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">Recommended Videos</ThemedText>
              <ThemedText
                style={{ color: inputPlaceholderColor, fontSize: 13 }}
              >
                {recommendedVideos.length} videos available
              </ThemedText>
            </View>

            {loading ? (
              <ActivityIndicator
                size="small"
                color={primaryButtonBg}
                style={{ marginVertical: 20 }}
              />
            ) : recommendedVideos.length === 0 ? (
              <View
                style={[
                  styles.emptyBox,
                  { backgroundColor: cardBg, borderColor: cardBorderColor },
                ]}
              >
                <Ionicons
                  name="videocam-outline"
                  size={32}
                  color={inputPlaceholderColor}
                />
                <ThemedText
                  style={{ color: inputPlaceholderColor, marginTop: 6 }}
                >
                  No recommended videos found for {query || activeCategory}.
                </ThemedText>
              </View>
            ) : (
              recommendedVideos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={[
                    styles.videoCard,
                    { backgroundColor: cardBg, borderColor: cardBorderColor },
                  ]}
                  onPress={() => handleOpenVideo(video)}
                  activeOpacity={0.85}
                >
                  <View style={styles.thumbnailContainer}>
                    {video.thumbnailUrl ? (
                      <Image
                        source={{ uri: video.thumbnailUrl }}
                        style={styles.thumbnail}
                      />
                    ) : (
                      <View
                        style={[
                          styles.thumbnailPlaceholder,
                          { backgroundColor: chipBg },
                        ]}
                      >
                        <Ionicons
                          name="barbell-outline"
                          size={36}
                          color={primaryButtonBg}
                        />
                      </View>
                    )}
                    <View style={styles.playOverlay}>
                      <Ionicons name="play" size={18} color="#FFFFFF" />
                    </View>
                    {video.durationMinutes ? (
                      <View style={styles.durationBadge}>
                        <ThemedText style={styles.durationText}>
                          {video.durationMinutes} min
                        </ThemedText>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.videoDetails}>
                    <ThemedText
                      type="defaultSemiBold"
                      numberOfLines={1}
                      style={styles.videoTitle}
                    >
                      {video.title}
                    </ThemedText>

                    {video.description ? (
                      <ThemedText
                        numberOfLines={2}
                        style={[
                          styles.videoDescription,
                          { color: inputPlaceholderColor },
                        ]}
                      >
                        {video.description}
                      </ThemedText>
                    ) : null}

                    <View style={styles.videoMetaRow}>
                      {video.channel ? (
                        <ThemedText
                          style={[styles.videoMeta, { color: primaryButtonBg }]}
                        >
                          📺 {video.channel}
                        </ThemedText>
                      ) : null}

                      {video.difficultyLevel ? (
                        <View
                          style={[styles.tagBadge, { backgroundColor: chipBg }]}
                        >
                          <ThemedText style={styles.tagText}>
                            {video.difficultyLevel}
                          </ThemedText>
                        </View>
                      ) : null}

                      {video.views ? (
                        <ThemedText
                          style={[
                            styles.videoMeta,
                            { color: inputPlaceholderColor },
                          ]}
                        >
                          {video.views}
                        </ThemedText>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Nearby Gyms Button & Collapsible Section */}
        {(activeCategory === "all" || activeCategory === "gyms") && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[
                styles.nearbyGymsButton,
                { backgroundColor: primaryButtonBg },
              ]}
              onPress={() => setShowNearbyGyms(!showNearbyGyms)}
            >
              <Ionicons name="location" size={20} color="#FFFFFF" />
              <ThemedText style={styles.nearbyGymsButtonText}>
                {showNearbyGyms
                  ? "Hide Nearby Gyms"
                  : "📍 Search Nearby Gyms & Centers"}
              </ThemedText>
            </TouchableOpacity>

            {(showNearbyGyms || activeCategory === "gyms") && (
              <ThemedView
                style={[
                  styles.gymsSection,
                  { backgroundColor: cardBg, borderColor: cardBorderColor },
                ]}
              >
                <ThemedText type="subtitle">
                  Nearby Gyms & Fitness Centers
                </ThemedText>
                {NEARBY_GYMS.map((gym) => (
                  <TouchableOpacity
                    key={gym.id}
                    style={[styles.gymCard, { borderColor: cardBorderColor }]}
                    onPress={() => handleOpenMap(gym.mapQuery)}
                  >
                    <View style={styles.gymHeader}>
                      <ThemedText type="defaultSemiBold">{gym.name}</ThemedText>
                      <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={14} color="#F59E0B" />
                        <ThemedText style={styles.ratingText}>
                          {gym.rating}
                        </ThemedText>
                      </View>
                    </View>

                    <ThemedText
                      style={{ color: inputPlaceholderColor, fontSize: 13 }}
                    >
                      {gym.address}
                    </ThemedText>

                    <View style={styles.gymFooter}>
                      <ThemedText
                        style={{
                          color: primaryButtonBg,
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        📍 {gym.distance} away
                      </ThemedText>
                      <ThemedText
                        style={{
                          color: primaryButtonBg,
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        Get Directions →
                      </ThemedText>
                    </View>
                  </TouchableOpacity>
                ))}
              </ThemedView>
            )}
          </View>
        )}

        {/* Recommended Topics */}
        {filteredTopics.length > 0 && (
          <View style={styles.section}>
            <ThemedText type="subtitle">Recommended Topics & Guides</ThemedText>

            {filteredTopics.map((topic) => (
              <TouchableOpacity
                key={topic.id}
                style={[
                  styles.topicCard,
                  { backgroundColor: cardBg, borderColor: cardBorderColor },
                ]}
                onPress={() => router.push("/AI")}
              >
                <View style={styles.topicHeader}>
                  <View
                    style={[styles.topicIconBg, { backgroundColor: chipBg }]}
                  >
                    <Ionicons
                      name={topic.icon}
                      size={20}
                      color={primaryButtonBg}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="defaultSemiBold">
                      {topic.title}
                    </ThemedText>
                    <ThemedText
                      style={{
                        color: inputPlaceholderColor,
                        fontSize: 13,
                        marginTop: 2,
                      }}
                    >
                      {topic.details}
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Training Buddies & Certified Trainers */}
        {(activeCategory === "all" || activeCategory === "buddies") && (
          <View style={styles.section}>
            <ThemedText type="subtitle">
              Training Buddies & Certified Trainers
            </ThemedText>

            {filteredBuddies.map((buddy) => (
              <View
                key={buddy.id}
                style={[
                  styles.buddyCard,
                  { backgroundColor: cardBg, borderColor: cardBorderColor },
                ]}
              >
                <Image
                  source={{ uri: buddy.avatar }}
                  style={styles.buddyAvatar}
                />

                <View style={styles.buddyInfo}>
                  <View style={styles.buddyNameRow}>
                    <ThemedText type="defaultSemiBold">{buddy.name}</ThemedText>
                    <View
                      style={[styles.roleBadge, { backgroundColor: chipBg }]}
                    >
                      <ThemedText
                        style={{
                          fontSize: 11,
                          color: primaryButtonBg,
                          fontWeight: "700",
                        }}
                      >
                        {buddy.role}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText
                    style={{
                      color: inputPlaceholderColor,
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    {buddy.level}
                  </ThemedText>

                  <View style={styles.buddyActionRow}>
                    <TouchableOpacity
                      style={[
                        styles.buddyBtn,
                        { backgroundColor: primaryButtonBg },
                      ]}
                      onPress={() => openBuddyChat(buddy)}
                    >
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={14}
                        color="#FFFFFF"
                      />
                      <ThemedText style={styles.buddyBtnText}>Chat</ThemedText>
                    </TouchableOpacity>

                    {buddy.role === "Trainer" ? (
                      <TouchableOpacity
                        style={[
                          styles.buddyBtn,
                          styles.buddyBtnOutline,
                          { borderColor: primaryButtonBg },
                        ]}
                        onPress={() => router.push("/bookTrainer")}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color={primaryButtonBg}
                        />
                        <ThemedText
                          style={[
                            styles.buddyBtnText,
                            { color: primaryButtonBg },
                          ]}
                        >
                          Book Session
                        </ThemedText>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  searchBarRow: {
    position: "relative",
    justifyContent: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 14,
    zIndex: 1,
  },
  searchInput: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingLeft: 42,
    paddingRight: 40,
    paddingVertical: 12,
    fontSize: 15,
  },
  clearBtn: {
    position: "absolute",
    right: 14,
    zIndex: 1,
    padding: 4,
  },
  categoriesScroll: {
    maxHeight: 44,
  },
  categoriesContainer: {
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 13,
  },
  emptyBox: {
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  videoCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 8,
  },
  thumbnailContainer: {
    height: 180,
    width: "100%",
    position: "relative",
    backgroundColor: "#000000",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  thumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  playOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -22,
    marginLeft: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.6)",
  },
  durationBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  videoDetails: {
    padding: 12,
    gap: 6,
  },
  videoHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  videoTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  videoDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  videoMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    flexWrap: "wrap",
  },
  videoMeta: {
    fontSize: 12,
    fontWeight: "600",
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },
  nearbyGymsButton: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  nearbyGymsButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  gymsSection: {
    padding: 14,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1,
    marginTop: 8,
  },
  gymCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 4,
  },
  gymHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontWeight: "700",
    fontSize: 13,
  },
  gymFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  topicCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  topicHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topicIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buddyCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  buddyAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  buddyInfo: {
    flex: 1,
  },
  buddyNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  buddyActionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  buddyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buddyBtnOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  buddyBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
