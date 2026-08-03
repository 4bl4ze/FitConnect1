import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkoutStore } from "@/stores/useWorkoutStore";

const COLORS = {
  blue: "#1677FF",
  blueDark: "#0B4FC4",
  background: "#08111F",
  surface: "#101D2E",
  surfaceLight: "#17263A",
  white: "#FFFFFF",
  text: "#F5F8FF",
  muted: "#9BAAC0",
  border: "rgba(255,255,255,0.10)",
  success: "#35D07F",
};

const IMAGES = {
  hero: require("../../assets/images/workouts/hero-workout.jpg"),
  upperBody: require("../../assets/images/workouts/upper-body.jpg"),
  lowerBody: require("../../assets/images/workouts/lower-body.jpg"),
  abs: require("../../assets/images/workouts/abs-workout.jpg"),
  chest: require("../../assets/images/workouts/chest-workout.jpg"),
};

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);

  const totalWorkouts =
    useWorkoutStore((state) => state.totalWorkouts) ?? 0;

  const streakDays =
    useWorkoutStore((state) => state.streakDays) ?? 0;

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Athlete";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>FITCONNECT</Text>
            <Text style={styles.tagline}>Train stronger every day</Text>
          </View>

          <Pressable
            style={styles.notificationButton}
            onPress={() => router.push("/notifications" as never)}
          >
            <Ionicons
              name="notifications-outline"
              size={23}
              color={COLORS.white}
            />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {/* Hero */}
        <ImageBackground
          source={IMAGES.hero}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="flash" size={13} color={COLORS.white} />
              <Text style={styles.heroBadgeText}>DAILY FITNESS</Text>
            </View>

            <Text style={styles.heroTitle}>
              Build your{"\n"}best body
            </Text>

            <Text style={styles.heroDescription}>
              Train consistently and become stronger with every workout.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/Workout" as never)}
            >
              <Text style={styles.primaryButtonText}>Start training</Text>
              <Ionicons
                name="arrow-forward"
                size={21}
                color={COLORS.white}
              />
            </Pressable>
          </View>
        </ImageBackground>

        {/* Welcome */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcomeLabel}>Welcome back</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>

          <View style={styles.trophyButton}>
            <Ionicons name="trophy" size={22} color={COLORS.blue} />
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsRow}>
          <StatCard
            icon="barbell"
            value={String(totalWorkouts)}
            label="Workouts"
          />

          <StatCard
            icon="flame"
            value="0"
            label="Calories"
          />

          <StatCard
            icon="medal"
            value={String(streakDays)}
            label="Day streak"
          />
        </View>

        {/* Recommended */}
        <SectionHeader
          eyebrow="RECOMMENDED"
          title="Today's workout"
          buttonText="View plan"
          onPress={() => router.push("/plan" as never)}
        />

        <ImageBackground
          source={IMAGES.upperBody}
          style={styles.featuredWorkout}
          imageStyle={styles.featuredImage}
        >
          <View style={styles.workoutOverlay} />

          <View style={styles.todayBadge}>
            <Text style={styles.todayBadgeText}>TODAY</Text>
          </View>

          <View style={styles.featuredBottom}>
            <View style={styles.featuredTextArea}>
              <Text style={styles.featuredTitle}>
                Upper Body Strength
              </Text>

              <Text style={styles.featuredSubtitle}>
                Chest, shoulders and triceps
              </Text>

              <View style={styles.workoutDetails}>
                <View style={styles.detailItem}>
                  <Ionicons
                    name="time-outline"
                    size={17}
                    color={COLORS.white}
                  />
                  <Text style={styles.detailText}>45 min</Text>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons
                    name="barbell-outline"
                    size={17}
                    color={COLORS.white}
                  />
                  <Text style={styles.detailText}>6 exercises</Text>
                </View>
              </View>
            </View>

            <Pressable
              style={styles.playButton}
              onPress={() => router.push("/Workout" as never)}
            >
              <Ionicons
                name="play"
                size={28}
                color={COLORS.white}
              />
            </Pressable>
          </View>
        </ImageBackground>

        {/* Programs */}
        <SectionHeader
          eyebrow="TRAINING PROGRAMS"
          title="Explore workouts"
        />

       <View style={styles.programsColumn}>
  <ProgramCard
    image={IMAGES.lowerBody}
    level="INTERMEDIATE"
    title="Lower Body"
    onPress={() => router.push("/Workout" as never)}
  />

  <ProgramCard
    image={IMAGES.abs}
    level="BEGINNER"
    title="Abs Workout"
    onPress={() => router.push("/Workout" as never)}
  />

  <ProgramCard
    image={IMAGES.chest}
    level="ADVANCED"
    title="Chest Power"
    onPress={() => router.push("/Workout" as never)}
  />
</View>
        {/* Quick Access */}
        <SectionHeader
          eyebrow="FITCONNECT"
          title="Quick access"
        />

        <View style={styles.quickGrid}>
          <QuickCard
            icon="calendar"
            title="Training plan"
            description="Organise your weekly training schedule."
            onPress={() => router.push("/plan" as never)}
          />

          <QuickCard
            icon="sparkles"
            title="AI assistant"
            description="Get personalised workout guidance."
            onPress={() => router.push("/AI" as never)}
          />

          <QuickCard
            icon="people"
            title="Book trainer"
            description="Work with an experienced fitness coach."
            onPress={() => router.push("/bookTrainer" as never)}
          />

          <QuickCard
            icon="stats-chart"
            title="Performance"
            description="Review your workout progress."
            onPress={() => router.push("/streaks" as never)}
          />
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Ionicons name="flame" size={30} color={COLORS.blue} />
          </View>

          <View style={styles.streakContent}>
            <Text style={styles.streakTitle}>
              {streakDays}-day workout streak
            </Text>

            <Text style={styles.streakDescription}>
              Keep showing up. Your consistency is building real results.
            </Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      Math.max((streakDays / 14) * 100, 8),
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Recent activity */}
        <SectionHeader
          eyebrow="ACTIVITY"
          title="Recent workout"
        />

        <View style={styles.recentCard}>
          <View style={styles.recentIcon}>
            <Ionicons
              name="barbell"
              size={26}
              color={COLORS.white}
            />
          </View>

          <View style={styles.recentContent}>
            <Text style={styles.recentTitle}>Upper Body Workout</Text>
            <Text style={styles.recentDescription}>
              Bench press, incline press and triceps dips
            </Text>
          </View>

          <View style={styles.completedIcon}>
            <Ionicons
              name="checkmark"
              size={19}
              color={COLORS.white}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type StatCardProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: string;
  label: string;
};

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={21} color={COLORS.white} />
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  buttonText?: string;
  onPress?: () => void;
};

function SectionHeader({
  eyebrow,
  title,
  buttonText,
  onPress,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      {buttonText ? (
        <Pressable onPress={onPress}>
          <Text style={styles.sectionButton}>{buttonText}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

type ProgramCardProps = {
  image: number;
  level: string;
  title: string;
  onPress: () => void;
};

function ProgramCard({
  image,
  level,
  title,
  onPress,
}: ProgramCardProps) {
  return (
    <Pressable onPress={onPress}>
      <ImageBackground
        source={image}
        style={styles.programCard}
        imageStyle={styles.programImage}
      >
        <View style={styles.programOverlay} />

        <View style={styles.programLevel}>
          <Text style={styles.programLevelText}>{level}</Text>
        </View>

        <Text style={styles.programTitle}>{title}</Text>
      </ImageBackground>
    </Pressable>
  );
}

type QuickCardProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  onPress: () => void;
};

function QuickCard({
  icon,
  title,
  description,
  onPress,
}: QuickCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.quickCard,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={24} color={COLORS.white} />
      </View>

      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickDescription}>{description}</Text>

      <Ionicons
        name="arrow-forward"
        size={22}
        color={COLORS.blue}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 120,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  brand: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  tagline: {
    color: COLORS.muted,
    fontSize: 13,
    marginTop: 4,
  },

  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.blue,
  },

  hero: {
    height: 440,
    justifyContent: "flex-end",
    marginBottom: 26,
  },

  heroImage: {
    borderRadius: 28,
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    backgroundColor: "rgba(2,7,15,0.48)",
  },

  heroContent: {
    padding: 24,
  },

  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.blue,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 13,
    marginBottom: 18,
  },

  heroBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 43,
    lineHeight: 46,
    fontWeight: "900",
  },

  heroDescription: {
    color: "#E4EAF5",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
    maxWidth: 285,
  },

  primaryButton: {
    marginTop: 22,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    backgroundColor: COLORS.blue,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  buttonPressed: {
    opacity: 0.78,
  },

  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  welcomeLabel: {
    color: COLORS.muted,
    fontSize: 14,
  },

  userName: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "800",
    marginTop: 3,
  },

  trophyButton: {
    width: 68,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
  },

  statCard: {
    flex: 1,
    minHeight: 135,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },

  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  statValue: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 8,
  },

  sectionEyebrow: {
    color: COLORS.blue,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 5,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "900",
  },

  sectionButton: {
    color: COLORS.blue,
    fontSize: 14,
    fontWeight: "800",
    paddingBottom: 3,
  },

  featuredWorkout: {
    height: 340,
    justifyContent: "space-between",
    padding: 18,
    marginBottom: 30,
  },

  featuredImage: {
    borderRadius: 26,
  },

  workoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 26,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  todayBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.blue,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  todayBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  featuredBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  featuredTextArea: {
    flex: 1,
    paddingRight: 12,
  },

  featuredTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: "900",
  },

  featuredSubtitle: {
    color: "#E1E7F0",
    fontSize: 14,
    marginTop: 6,
  },

  workoutDetails: {
    flexDirection: "row",
    gap: 18,
    marginTop: 14,
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  detailText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  playButton: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
  },

  programsColumn: {
  gap: 16,
  marginBottom: 30,
},

  programCard: {
    width: "100%",
    height: 260,
    justifyContent: "space-between",
    padding: 16,
  },

  programImage: {
    borderRadius: 24,
  },

  programOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.30)",
  },

  programLevel: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.blue,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  programLevelText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  programTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 28,
  },

  quickCard: {
    width: "48.5%",
    minHeight: 210,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 17,
  },

  quickIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  quickTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 7,
  },

  quickDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },

  streakCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 30,
  },

  streakIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },

  streakContent: {
    flex: 1,
  },

  streakTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "900",
  },

  streakDescription: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  progressTrack: {
    height: 7,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 16,
  },

  progressFill: {
    height: "100%",
    backgroundColor: COLORS.blue,
    borderRadius: 999,
  },

  recentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 17,
  },

  recentIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
  },

  recentContent: {
    flex: 1,
    marginHorizontal: 14,
  },

  recentTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  recentDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },

  completedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.success,
    alignItems: "center",
    justifyContent: "center",
  },
});