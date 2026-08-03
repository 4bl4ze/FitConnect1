import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/useAuthStore";
import { useWorkoutStore } from "@/stores/useWorkoutStore";

type ThemeStyleProps = {
  backgroundColor: string;
  textColor: string;
  tintColor: string;
  iconColor: string;
  surfaceColor: string;
  surfaceLightColor: string;
  mutedColor: string;
  borderColor: string;
  successColor: string;
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

  const heroSlides = [
    IMAGES.upperBody,
    IMAGES.lowerBody,
    IMAGES.abs,
    IMAGES.chest,
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const heroSource = heroSlides[currentHeroIndex];

  const totalWorkouts = useWorkoutStore((state) => state.totalWorkouts) ?? 0;

  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");
  const surfaceColor = useThemeColor(
    { light: "#FFFFFF", dark: "#101D2E" },
    "background",
  );
  const surfaceLightColor = useThemeColor(
    { light: "#F3F4F6", dark: "#17263A" },
    "background",
  );
  const mutedColor = useThemeColor(
    { light: "#6B7280", dark: "#9CA3AF" },
    "icon",
  );
  const borderColor = useThemeColor(
    { light: "rgba(0,0,0,0.08)", dark: "rgba(255,255,255,0.10)" },
    "icon",
  );
  const successColor = "#35D07F";

  const dayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const todaysPlan = useWorkoutStore((state) => state.plansByDay[dayKey]);
  const recentWorkouts = useWorkoutStore((state) => state.recentWorkouts);
  const streakDays = useWorkoutStore((state) => state.streakDays) ?? 0;

  const styles = useMemo(
    () =>
      createStyles({
        backgroundColor,
        textColor,
        tintColor,
        iconColor,
        surfaceColor,
        surfaceLightColor,
        mutedColor,
        borderColor,
        successColor,
      }),
    [
      backgroundColor,
      textColor,
      tintColor,
      iconColor,
      surfaceColor,
      surfaceLightColor,
      mutedColor,
      borderColor,
    ],
  );
  const statusBarStyle =
    colorScheme === "dark" ? "light-content" : "dark-content";

  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Athlete";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={statusBarStyle} />

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
              color={textColor}
            />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {/* Hero */}
        <ImageBackground
          source={heroSource}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Ionicons name="flash" size={13} color={textColor} />
              <Text style={styles.heroBadgeText}>DAILY FITNESS</Text>
            </View>

            <View style={styles.heroPager}>
              {heroSlides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.heroDot,
                    index === currentHeroIndex && styles.heroDotActive,
                  ]}
                />
              ))}
            </View>

            <Text style={styles.heroTitle}>Build your{"\n"}best body</Text>

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
              <Ionicons name="arrow-forward" size={21} color={textColor} />
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
            <Ionicons name="trophy" size={22} color={tintColor} />
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsRow}>
          <StatCard
            icon="barbell"
            value={String(totalWorkouts)}
            label="Workouts"
            styles={styles}
          />

          <StatCard icon="flame" value="0" label="Calories" styles={styles} />

          <StatCard
            icon="medal"
            value={String(streakDays)}
            label="Day streak"
            styles={styles}
          />
        </View>

        {/* Recommended */}
        <SectionHeader
          eyebrow="RECOMMENDED"
          title="Today's workout"
          buttonText="View plan"
          onPress={() => router.push("/plan" as never)}
          styles={styles}
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
                {todaysPlan?.title ?? "Today's workout"}
              </Text>

              <Text style={styles.featuredSubtitle}>
                {todaysPlan?.description ??
                  "Open your plan to set today's workout."}
              </Text>

              <View style={styles.workoutDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={17} color={textColor} />
                  <Text style={styles.detailText}>
                    {todaysPlan?.durationMinutes ?? 45} min
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Ionicons
                    name="barbell-outline"
                    size={17}
                    color={textColor}
                  />
                  <Text style={styles.detailText}>
                    {todaysPlan?.exercises ?? 6} exercises
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              style={styles.playButton}
              onPress={() => router.push("/plan" as never)}
            >
              <Ionicons name="play" size={28} color={textColor} />
            </Pressable>
          </View>
        </ImageBackground>

        {/* Quick Access */}
        <SectionHeader
          eyebrow="FITCONNECT"
          title="Quick access"
          styles={styles}
        />

        <View style={styles.quickGrid}>
          <QuickCard
            icon="calendar"
            title="Training plan"
            description="Organise your weekly training schedule."
            onPress={() => router.push("/plan" as never)}
            styles={styles}
          />

          <QuickCard
            icon="sparkles"
            title="AI assistant"
            description="Get personalised workout guidance."
            onPress={() => router.push("/AI" as never)}
            styles={styles}
          />

          <QuickCard
            icon="people"
            title="Book trainer"
            description="Work with an experienced fitness coach."
            onPress={() => router.push("/bookTrainer" as never)}
            styles={styles}
          />

          <QuickCard
            icon="stats-chart"
            title="Performance"
            description="Review your workout progress."
            onPress={() => router.push("/streaks" as never)}
            styles={styles}
          />
        </View>

        {/* Streak */}
        <View style={styles.streakCard}>
          <View style={styles.streakIcon}>
            <Ionicons name="flame" size={30} color={tintColor} />
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
                      100,
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
          title="Recent workouts"
          styles={styles}
        />

        {recentWorkouts.length > 0 ? (
          recentWorkouts.map((workout) => (
            <View key={workout.id} style={styles.recentCard}>
              <View style={styles.recentIcon}>
                <Ionicons name="barbell" size={26} color={textColor} />
              </View>

              <View style={styles.recentContent}>
                <Text style={styles.recentTitle}>{workout.title}</Text>
                <Text style={styles.recentDescription}>
                  {workout.exercises} exercises · {workout.durationMinutes} min
                </Text>
              </View>

              <View style={styles.completedIcon}>
                <Ionicons name="checkmark" size={19} color={textColor} />
              </View>
            </View>
          ))
        ) : (
          <View style={styles.recentCard}>
            <View style={styles.recentIcon}>
              <Ionicons name="barbell" size={26} color={textColor} />
            </View>

            <View style={styles.recentContent}>
              <Text style={styles.recentTitle}>No recent workouts</Text>
              <Text style={styles.recentDescription}>
                Finish a workout to see it listed here.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type StatCardProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: string;
  label: string;
  styles: ReturnType<typeof createStyles>;
};

function StatCard({ icon, value, label, styles }: StatCardProps) {
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={21} color={textColor} />
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
  styles: ReturnType<typeof createStyles>;
};

function SectionHeader({
  eyebrow,
  title,
  buttonText,
  onPress,
  styles,
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
  styles: ReturnType<typeof createStyles>;
};

function ProgramCard({
  image,
  level,
  title,
  onPress,
  styles,
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
  styles: ReturnType<typeof createStyles>;
};

function QuickCard({
  icon,
  title,
  description,
  onPress,
  styles,
}: QuickCardProps) {
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  return (
    <Pressable
      style={({ pressed }) => [
        styles.quickCard,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.quickIcon}>
        <Ionicons name={icon} size={24} color={textColor} />
      </View>

      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickDescription}>{description}</Text>

      <Ionicons name="arrow-forward" size={22} color={tintColor} />
    </Pressable>
  );
}

const createStyles = (props: ThemeStyleProps) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: props.backgroundColor,
    },

    container: {
      flex: 1,
      backgroundColor: props.backgroundColor,
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
      color: props.textColor,
      fontSize: 22,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    tagline: {
      color: props.mutedColor,
      fontSize: 13,
      marginTop: 4,
    },

    notificationButton: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: props.surfaceColor,
      borderWidth: 1,
      borderColor: props.borderColor,
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
      backgroundColor: props.tintColor,
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
      backgroundColor: props.tintColor,
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 13,
      marginBottom: 18,
    },

    heroBadgeText: {
      color: props.textColor,
      fontSize: 11,
      fontWeight: "800",
      letterSpacing: 1.2,
    },

    heroPager: {
      flexDirection: "row",
      gap: 8,
      marginTop: 14,
      marginBottom: 14,
    },

    heroDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "rgba(255,255,255,0.35)",
    },

    heroDotActive: {
      backgroundColor: props.textColor,
    },

    heroTitle: {
      color: props.textColor,
      fontSize: 43,
      lineHeight: 46,
      fontWeight: "900",
    },

    heroDescription: {
      color: props.textColor,
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
      backgroundColor: props.tintColor,
      borderRadius: 18,
      paddingHorizontal: 20,
      paddingVertical: 16,
    },

    primaryButtonText: {
      color: props.textColor,
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
      color: props.mutedColor,
      fontSize: 14,
    },

    userName: {
      color: props.textColor,
      fontSize: 25,
      fontWeight: "800",
      marginTop: 3,
    },

    trophyButton: {
      width: 68,
      height: 48,
      borderRadius: 16,
      backgroundColor: props.surfaceColor,
      borderWidth: 1,
      borderColor: props.borderColor,
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
      backgroundColor: props.surfaceColor,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: props.borderColor,
      padding: 14,
    },

    statIcon: {
      width: 42,
      height: 42,
      borderRadius: 13,
      backgroundColor: props.tintColor,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 15,
    },

    statValue: {
      color: props.textColor,
      fontSize: 22,
      fontWeight: "900",
    },

    statLabel: {
      color: props.textColor,
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
      color: props.tintColor,
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 2,
      marginBottom: 5,
    },

    sectionTitle: {
      color: props.textColor,
      fontSize: 26,
      fontWeight: "900",
    },

    sectionButton: {
      color: props.tintColor,
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
      backgroundColor: props.tintColor,
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 999,
    },

    todayBadgeText: {
      color: props.textColor,
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
      color: props.textColor,
      fontSize: 28,
      fontWeight: "900",
    },

    featuredSubtitle: {
      color: props.textColor,
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
      color: props.textColor,
      fontSize: 13,
      fontWeight: "700",
    },

    playButton: {
      width: 64,
      height: 64,
      borderRadius: 20,
      backgroundColor: props.tintColor,
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
      backgroundColor: props.tintColor,
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },

    programLevelText: {
      color: props.textColor,
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.2,
    },

    programTitle: {
      color: props.textColor,
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
      backgroundColor: props.surfaceColor,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: props.borderColor,
      padding: 17,
    },

    quickIcon: {
      width: 48,
      height: 48,
      borderRadius: 15,
      backgroundColor: props.tintColor,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
    },

    quickTitle: {
      color: props.textColor,
      fontSize: 17,
      fontWeight: "800",
      marginBottom: 7,
    },

    quickDescription: {
      color: props.textColor,
      fontSize: 13,
      lineHeight: 19,
      flex: 1,
    },

    streakCard: {
      flexDirection: "row",
      backgroundColor: props.surfaceLightColor,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: props.borderColor,
      padding: 20,
      marginBottom: 30,
    },

    streakIcon: {
      width: 58,
      height: 58,
      borderRadius: 18,
      backgroundColor: props.surfaceColor,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 15,
    },

    streakContent: {
      flex: 1,
    },

    streakTitle: {
      color: props.textColor,
      fontSize: 18,
      fontWeight: "900",
    },

    streakDescription: {
      color: props.textColor,
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
      backgroundColor: props.tintColor,
      borderRadius: 999,
    },

    recentCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: props.surfaceColor,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: props.borderColor,
      padding: 17,
    },

    recentIcon: {
      width: 56,
      height: 56,
      borderRadius: 18,
      backgroundColor: props.tintColor,
      alignItems: "center",
      justifyContent: "center",
    },

    recentContent: {
      flex: 1,
      marginHorizontal: 14,
    },

    recentTitle: {
      color: props.textColor,
      fontSize: 15,
      fontWeight: "800",
    },

    recentDescription: {
      color: props.textColor,
      fontSize: 12,
      lineHeight: 18,
      marginTop: 4,
    },

    completedIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: props.successColor,
      alignItems: "center",
      justifyContent: "center",
    },
  });
