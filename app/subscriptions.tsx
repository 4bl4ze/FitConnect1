import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

type Plan = "Basic" | "Monthly Pro Plan" | "Annual Pro Plan";

const plans: { id: Plan; title: string; description: string }[] = [
  {
    id: "Basic",
    title: "Basic",
    description: "Workout tracking",
  },
  {
    id: "Monthly Pro Plan (GHs 30)",
    title: "Monthly Pro Plan (GHs 30)",
    description: "Workout tracking + Unlimited AI access",
  },
  {
    id: "Annual Pro Plan (GHs 250)",
    title: "Annual Pro Plan (GHs 250)",
    description: "Keep your pro features for a year",
  },
];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("Basic");

  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background",
  );

  const subscribe = () => {
    Alert.alert("Subscription Successful", `You selected the ${selectedPlan} `);

    // Later:
    // Save to Firebase
    // Update Zustand Store
    // Call Stripe RevenueCat API
  };

  const cancelSubscription = () => {
    Alert.alert(
      "Subscription Cancelled",
      "Your subscription has been cancelled.",
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Subscriptions</ThemedText>

      <ThemedText>Choose a plan that matches your fitness goals.</ThemedText>

      <View style={styles.planContainer}>
        {plans.map((plan) => (
          <Pressable
            key={plan.id}
            onPress={() => setSelectedPlan(plan.id)}
            style={[
              styles.card,
              {
                backgroundColor: cardBg,
                borderColor: selectedPlan === plan.id ? "#007AFF" : "#D1D5DB",
              },
            ]}
          >
            <ThemedText type="defaultSemiBold">{plan.title}</ThemedText>
            <ThemedText>{plan.description}</ThemedText>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.primaryButton} onPress={subscribe}>
        <ThemedText>Subscribe to {selectedPlan}</ThemedText>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={cancelSubscription}>
        <ThemedText>Cancel Subscription</ThemedText>
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => router.replace("/(tabs)/profile")}
      >
        <ThemedText>Back to Profile</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  planContainer: {
    gap: 12,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#4CAF50",
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#EF4444",
  },
  backButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#9CA3AF",
  },
});
