import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  background: "#090D0C",
  surface: "#131918",
  surfaceLight: "#1C2422",
  green: "#C8FF3D",
  darkGreen: "#113C32",
  white: "#FFFFFF",
  muted: "#A7B1AE",
  orange: "#FF7433",
  purple: "#8B6CFF",
  blue: "#4AA8FF",
};

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top navigation */}
        <View style={styles.topNavigation}>
          <View>
            <Text style={styles.brandName}>FitConnect</Text>
            <Text style={styles.brandSubtitle}>
              Train stronger every day
            </Text>
          </View>

          <Pressable style={styles.notificationButton}>
            <Ionicons
              name="notifications-outline"
              size={23}
              color={COLORS.white}
            />

            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {/* 3D hero section */}
       <View style={styles.heroShadow}>
  <ImageBackground
    source={require("../../assets/images/workouts/hero-workout.jpg")}
    style={styles.realHeroCard}
    imageStyle={styles.realHeroImage}
  >
    <View style={styles.realHeroOverlay} />

    <View style={styles.realHeroContent}>
      <View style={styles.heroLabel}>
        <Ionicons
          name="flash"
          size={13}
          color={COLORS.darkGreen}
        />

        <Text style={styles.heroLabelText}>
          DAILY FITNESS
        </Text>
      </View>

      <Text style={styles.realHeroTitle}>
        Build your{"\n"}best body
      </Text>

      <Text style={styles.realHeroDescription}>
        Train consistently and become stronger with every workout.
      </Text>

      <Pressable
        style={styles.heroButton}
        onPress={() => router.push("/Workout" as any)}
      >
        <Text style={styles.heroButtonText}>
          Start training
        </Text>

        <Ionicons
          name="arrow-forward"
          size={19}
          color={COLORS.darkGreen}
        />
      </Pressable>
    </View>
  </ImageBackground>
</View>

        {/* Greeting */}
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.userName}>Demo User</Text>
          </View>

          <View style={styles.levelBadge}>
            <Ionicons
              name="trophy"
              size={17}
              color={COLORS.green}
            />

            <Text style={styles.levelText}>Level 8</Text>
          </View>
        </View>

        {/* Progress cards */}
        <View style={styles.statsRow}>
          <View style={styles.statShadow}>
            <View style={styles.statCard}>
              <View style={styles.statIconGreen}>
                <MaterialCommunityIcons
                  name="dumbbell"
                  size={21}
                  color={COLORS.darkGreen}
                />
              </View>

              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>

          <View style={styles.statShadow}>
            <View style={styles.statCard}>
              <View style={styles.statIconOrange}>
                <Ionicons
                  name="flame"
                  size={22}
                  color={COLORS.orange}
                />
              </View>

              <Text style={styles.statValue}>5.2k</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          </View>

          <View style={styles.statShadow}>
            <View style={styles.statCard}>
              <View style={styles.statIconPurple}>
                <Ionicons
                  name="medal"
                  size={21}
                  color={COLORS.purple}
                />
              </View>

              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Day streak</Text>
            </View>
          </View>
        </View>

        {/* Today's workout heading */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>RECOMMENDED</Text>
            <Text style={styles.sectionTitle}>
              Today&apos;s workout
            </Text>
          </View>

          <Pressable
            onPress={() => router.push("/Workout" as any)}
          >
            <Text style={styles.viewAllText}>View plan</Text>
          </Pressable>
        </View>

        {/* Main workout photo card */}
        <Pressable
          style={styles.mainWorkoutShadow}
          onPress={() => router.push("/Workout" as any)}
        >
          <ImageBackground
            source={require("../../assets/images/workouts/upper-body.jpg")}
            style={styles.mainWorkoutCard}
            imageStyle={styles.mainWorkoutImage}
          >
            <View style={styles.mainWorkoutOverlay} />

            <View style={styles.mainWorkoutContent}>
              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>TODAY</Text>
              </View>

              <View style={styles.mainWorkoutBottom}>
                <View>
                  <Text style={styles.mainWorkoutTitle}>
                    Upper Body Strength
                  </Text>

                  <Text style={styles.mainWorkoutDescription}>
                    Chest, shoulders and triceps
                  </Text>

                  <View style={styles.workoutInformation}>
                    <View style={styles.informationItem}>
                      <Ionicons
                        name="time-outline"
                        size={17}
                        color={COLORS.white}
                      />

                      <Text style={styles.informationText}>
                        45 min
                      </Text>
                    </View>

                    <View style={styles.informationItem}>
                      <MaterialCommunityIcons
                        name="dumbbell"
                        size={17}
                        color={COLORS.white}
                      />

                      <Text style={styles.informationText}>
                        6 exercises
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.playButtonShadow}>
                  <View style={styles.playButton}>
                    <Ionicons
                      name="play"
                      size={25}
                      color={COLORS.darkGreen}
                    />
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </Pressable>

        {/* Workout collections */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              TRAINING PROGRAMS
            </Text>
            <Text style={styles.sectionTitle}>
              Explore workouts
            </Text>
          </View>
        </View>

        <View style={styles.workoutGrid}>
          {/* Lower body */}
          <Pressable
            style={styles.smallCardShadow}
            onPress={() => router.push("/Workout" as any)}
          >
            <ImageBackground
              source={require("../../assets/images/workouts/lower-body.jpg")}
              style={styles.smallWorkoutCard}
              imageStyle={styles.smallWorkoutImage}
            >
              <View style={styles.smallWorkoutOverlay} />

              <View style={styles.smallWorkoutContent}>
                <View style={styles.difficultyBadge}>
                  <Text style={styles.difficultyText}>
                    INTERMEDIATE
                  </Text>
                </View>

                <View>
                  <Text style={styles.smallWorkoutTitle}>
                    Lower Body
                  </Text>

                  <Text style={styles.smallWorkoutDescription}>
                    8 exercises • 40 min
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>

          {/* Abs */}
          <Pressable
            style={styles.smallCardShadow}
            onPress={() => router.push("/Workout" as any)}
          >
            <ImageBackground
              source={require("../../assets/images/workouts/abs-workout.jpg")}
              style={styles.smallWorkoutCard}
              imageStyle={styles.smallWorkoutImage}
            >
              <View style={styles.smallWorkoutOverlay} />

              <View style={styles.smallWorkoutContent}>
                <View style={styles.beginnerBadge}>
                  <Text style={styles.beginnerBadgeText}>
                    BEGINNER
                  </Text>
                </View>

                <View>
                  <Text style={styles.smallWorkoutTitle}>
                    Abs Workout
                  </Text>

                  <Text style={styles.smallWorkoutDescription}>
                    6 exercises • 20 min
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        </View>

        {/* Chest workout */}
        <Pressable
          style={styles.wideCardShadow}
          onPress={() => router.push("/Workout" as any)}
        >
          <ImageBackground
            source={require("../../assets/images/workouts/chest-workout.jpg")}
            style={styles.wideWorkoutCard}
            imageStyle={styles.wideWorkoutImage}
          >
            <View style={styles.wideWorkoutOverlay} />

            <View style={styles.wideWorkoutContent}>
              <View style={styles.wideWorkoutText}>
                <Text style={styles.sectionEyebrowLight}>
                  STRENGTH TRAINING
                </Text>

                <Text style={styles.wideWorkoutTitle}>
                  Chest Builder
                </Text>

                <Text style={styles.wideWorkoutDescription}>
                  Build strength and upper-body power.
                </Text>
              </View>

              <View style={styles.wideArrow}>
                <Ionicons
                  name="arrow-forward"
                  size={21}
                  color={COLORS.darkGreen}
                />
              </View>
            </View>
          </ImageBackground>
        </Pressable>

        {/* Quick actions */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>FITCONNECT</Text>
            <Text style={styles.sectionTitle}>Quick access</Text>
          </View>
        </View>

        <View style={styles.quickActionsGrid}>
          <Pressable
            style={styles.quickActionShadow}
            onPress={() => router.push("/Workout" as any)}
          >
            <View style={styles.quickActionCard}>
              <View style={styles.quickIconGreen}>
                <Ionicons
                  name="calendar"
                  size={25}
                  color={COLORS.darkGreen}
                />
              </View>

              <Text style={styles.quickActionTitle}>
                Workout Planner
              </Text>

              <Text style={styles.quickActionDescription}>
                Organise your weekly training schedule.
              </Text>

              <Ionicons
                name="arrow-forward"
                size={19}
                color={COLORS.green}
              />
            </View>
          </Pressable>

          <Pressable
            style={styles.quickActionShadow}
            onPress={() => router.push("/AI" as any)}
          >
            <View style={styles.quickActionCard}>
              <View style={styles.quickIconPurple}>
                <Ionicons
                  name="sparkles"
                  size={25}
                  color={COLORS.purple}
                />
              </View>

              <Text style={styles.quickActionTitle}>
                AI Trainer
              </Text>

              <Text style={styles.quickActionDescription}>
                Get personalised workout guidance.
              </Text>

              <Ionicons
                name="arrow-forward"
                size={19}
                color={COLORS.green}
              />
            </View>
          </Pressable>

          <Pressable
            style={styles.quickActionShadow}
            onPress={() => router.push("/bookTrainer" as any)}
          >
            <View style={styles.quickActionCard}>
              <View style={styles.quickIconOrange}>
                <Ionicons
                  name="people"
                  size={25}
                  color={COLORS.orange}
                />
              </View>

              <Text style={styles.quickActionTitle}>
                Book Trainer
              </Text>

              <Text style={styles.quickActionDescription}>
                Work with an experienced fitness coach.
              </Text>

              <Ionicons
                name="arrow-forward"
                size={19}
                color={COLORS.green}
              />
            </View>
          </Pressable>

          <View style={styles.quickActionShadow}>
            <View style={styles.quickActionCard}>
              <View style={styles.quickIconBlue}>
                <Ionicons
                  name="stats-chart"
                  size={25}
                  color={COLORS.blue}
                />
              </View>

              <Text style={styles.quickActionTitle}>
                Progress
              </Text>

              <Text style={styles.quickActionDescription}>
                Review your workout performance.
              </Text>

              <Ionicons
                name="arrow-forward"
                size={19}
                color={COLORS.green}
              />
            </View>
          </View>
        </View>

        {/* Streak card */}
        <View style={styles.streakShadow}>
          <View style={styles.streakCard}>
            <View style={styles.streakFlameOuter}>
              <View style={styles.streakFlameInner}>
                <Ionicons
                  name="flame"
                  size={32}
                  color={COLORS.orange}
                />
              </View>
            </View>

            <View style={styles.streakTextContainer}>
              <Text style={styles.streakTitle}>
                12-day workout streak
              </Text>

              <Text style={styles.streakDescription}>
                Keep showing up. Your consistency is building real
                results.
              </Text>

              <View style={styles.streakProgressBackground}>
                <View style={styles.streakProgressFill} />
              </View>
            </View>
          </View>
        </View>

        {/* Recent activity */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>ACTIVITY</Text>
            <Text style={styles.sectionTitle}>Recent workout</Text>
          </View>
        </View>

        <View style={styles.recentShadow}>
          <View style={styles.recentCard}>
            <View style={styles.recentIconLayerBack} />

            <View style={styles.recentIcon}>
              <MaterialCommunityIcons
                name="arm-flex"
                size={28}
                color={COLORS.darkGreen}
              />
            </View>

            <View style={styles.recentContent}>
              <Text style={styles.recentTitle}>Push Day</Text>

              <Text style={styles.recentDescription}>
                Bench press, incline press and triceps dips
              </Text>

              <View style={styles.recentDetails}>
                <Text style={styles.recentDetailText}>60 min</Text>
                <View style={styles.recentDot} />
                <Text style={styles.recentDetailText}>520 kcal</Text>
              </View>
            </View>

            <Ionicons
              name="checkmark-circle"
              size={26}
              color="#50C878"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createShadow = (
  shadowColor: string,
  elevation: number,
) => ({
  shadowColor,
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.28,
  shadowRadius: 12,
  elevation,
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? 18 : 0,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 130,
  },

  topNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  brandName: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  brandSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 3,
  },

  notificationButton: {
    width: 47,
    height: 47,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#293330",
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 11,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.orange,
    borderWidth: 1.5,
    borderColor: COLORS.surfaceLight,
  },

  heroShadow: {
    borderRadius: 30,
    marginBottom: 26,
    ...createShadow("#000000", 12),
  },

  heroCard: {
    minHeight: 290,
    borderRadius: 30,
    backgroundColor: COLORS.darkGreen,
    overflow: "hidden",
    padding: 22,
  },

  heroGlowOne: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(200,255,61,0.11)",
    right: -65,
    top: -40,
  },

  heroGlowTwo: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.04)",
    left: -55,
    bottom: -60,
  },

  heroTextContainer: {
    width: "61%",
    zIndex: 5,
  },

  heroLabel: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.green,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9,
    marginBottom: 15,
  },

  heroLabelText: {
    color: COLORS.darkGreen,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 37,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: -1.5,
  },

  heroDescription: {
    color: "#D5E0DC",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 11,
  },

  heroButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.green,
    paddingHorizontal: 17,
    height: 47,
    borderRadius: 15,
    marginTop: 19,
  },

  heroButtonText: {
    color: COLORS.darkGreen,
    fontSize: 13,
    fontWeight: "900",
  },

  graphicShadow: {
    position: "absolute",
    right: 8,
    bottom: 34,
    width: 132,
    height: 160,
    ...createShadow("#000000", 10),
  },

  graphicPlatform: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  graphicBackLayer: {
    position: "absolute",
    width: 115,
    height: 130,
    borderRadius: 32,
    backgroundColor: "#275B49",
    transform: [{ rotate: "8deg" }],
  },

  graphicCircle: {
    width: 116,
    height: 130,
    borderRadius: 32,
    backgroundColor: "#1B493C",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(200,255,61,0.15)",
  },

  graphicFrontLayer: {
    position: "absolute",
    bottom: -12,
    right: 2,
    width: 61,
    height: 61,
    borderRadius: 20,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-9deg" }],
    ...createShadow("#000000", 8),
  },

  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  greeting: {
    color: COLORS.muted,
    fontSize: 14,
  },

  userName: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: "900",
    marginTop: 2,
  },

  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 13,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#26302E",
  },

  levelText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 31,
  },

  statShadow: {
    flex: 1,
    borderRadius: 20,
    ...createShadow("#000000", 8),
  },

  statCard: {
    minHeight: 134,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    padding: 13,
    borderWidth: 1,
    borderColor: "#222C29",
  },

  statIconGreen: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  statIconOrange: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#332018",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  statIconPurple: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#251F3C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  statValue: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "900",
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 5,
  },

  sectionEyebrow: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  sectionEyebrowLight: {
    color: COLORS.green,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.1,
    marginBottom: 5,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  viewAllText: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: "800",
  },

  mainWorkoutShadow: {
    borderRadius: 27,
    marginBottom: 32,
    ...createShadow("#000000", 13),
  },

  mainWorkoutCard: {
    height: 330,
    justifyContent: "flex-end",
    borderRadius: 27,
    overflow: "hidden",
  },

  mainWorkoutImage: {
    borderRadius: 27,
  },

  mainWorkoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.43)",
  },

  mainWorkoutContent: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },

  todayBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.green,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9,
  },

  todayBadgeText: {
    color: COLORS.darkGreen,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  mainWorkoutBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  mainWorkoutTitle: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  mainWorkoutDescription: {
    color: "#E2E7E5",
    fontSize: 13,
    marginTop: 5,
  },

  workoutInformation: {
    flexDirection: "row",
    gap: 17,
    marginTop: 13,
  },

  informationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  informationText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  playButtonShadow: {
    borderRadius: 24,
    ...createShadow("#000000", 8),
  },

  playButton: {
    width: 63,
    height: 63,
    borderRadius: 22,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },

  workoutGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 13,
  },

  smallCardShadow: {
    flex: 1,
    borderRadius: 23,
    ...createShadow("#000000", 9),
  },

  smallWorkoutCard: {
    height: 235,
    borderRadius: 23,
    overflow: "hidden",
  },

  smallWorkoutImage: {
    borderRadius: 23,
  },

  smallWorkoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.42)",
  },

  smallWorkoutContent: {
    flex: 1,
    padding: 14,
    justifyContent: "space-between",
  },

  difficultyBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.orange,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  difficultyText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  beginnerBadge: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.green,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
  },

  beginnerBadgeText: {
    color: COLORS.darkGreen,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  smallWorkoutTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: "900",
  },

  smallWorkoutDescription: {
    color: "#E6E9E8",
    fontSize: 11,
    marginTop: 4,
  },

  wideCardShadow: {
    borderRadius: 24,
    marginBottom: 31,
    ...createShadow("#000000", 10),
  },

  wideWorkoutCard: {
    height: 190,
    borderRadius: 24,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  wideWorkoutImage: {
    borderRadius: 24,
  },

  wideWorkoutOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.48)",
  },

  wideWorkoutContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 18,
  },

  wideWorkoutText: {
    flex: 1,
  },

  wideWorkoutTitle: {
    color: COLORS.white,
    fontSize: 23,
    fontWeight: "900",
  },

  wideWorkoutDescription: {
    color: "#DDE3E0",
    fontSize: 12,
    marginTop: 5,
  },

  wideArrow: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
  },

  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 13,
    marginBottom: 28,
  },

  quickActionShadow: {
    width: "48.3%",
    borderRadius: 21,
    ...createShadow("#000000", 8),
  },

  quickActionCard: {
    minHeight: 190,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderWidth: 1,
    borderColor: "#222C29",
  },

  quickIconGreen: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  quickIconPurple: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: "#251F3C",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  quickIconOrange: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: "#332018",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  quickIconBlue: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: "#172C3D",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  quickActionTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
  },

  quickActionDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
    marginBottom: 13,
  },

  streakShadow: {
    borderRadius: 25,
    marginBottom: 31,
    ...createShadow("#000000", 9),
  },

  streakCard: {
    minHeight: 145,
    borderRadius: 25,
    backgroundColor: "#241A14",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    borderWidth: 1,
    borderColor: "#3D291F",
  },

  streakFlameOuter: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: "#302119",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-6deg" }],
  },

  streakFlameInner: {
    width: 53,
    height: 53,
    borderRadius: 18,
    backgroundColor: "#FFF4ED",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "6deg" }],
    ...createShadow("#000000", 5),
  },

  streakTextContainer: {
    flex: 1,
  },

  streakTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
  },

  streakDescription: {
    color: "#C8BDB7",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },

  streakProgressBackground: {
    height: 6,
    borderRadius: 4,
    backgroundColor: "#4A3428",
    overflow: "hidden",
    marginTop: 13,
  },

  streakProgressFill: {
    width: "78%",
    height: "100%",
    backgroundColor: COLORS.orange,
    borderRadius: 4,
  },

  recentShadow: {
    borderRadius: 23,
    ...createShadow("#000000", 8),
  },

  recentCard: {
    minHeight: 117,
    borderRadius: 23,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 15,
    borderWidth: 1,
    borderColor: "#222C29",
    overflow: "hidden",
  },

  recentIconLayerBack: {
    position: "absolute",
    left: 13,
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#355130",
    transform: [{ rotate: "9deg" }],
  },

  recentIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.green,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  recentContent: {
    flex: 1,
  },

  recentTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
  },

  recentDescription: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  recentDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 7,
  },

  recentDetailText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },

  recentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.muted,
  },realHeroCard: {
  height: 310,
  borderRadius: 30,
  overflow: "hidden",
  justifyContent: "flex-end",
},

realHeroImage: {
  borderRadius: 30,
},

realHeroOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: "rgba(0, 0, 0, 0.48)",
},

realHeroContent: {
  flex: 1,
  justifyContent: "flex-end",
  padding: 22,
  paddingBottom: 24,
},

realHeroTitle: {
  color: COLORS.white,
  fontSize: 36,
  lineHeight: 39,
  fontWeight: "900",
  letterSpacing: -1.4,
},

realHeroDescription: {
  color: "#E1E7E4",
  fontSize: 13,
  lineHeight: 19,
  marginTop: 10,
  width: "75%",
},
})