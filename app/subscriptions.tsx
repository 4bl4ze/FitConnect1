import { useState } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
} from "react-native";
import { router } from "expo-router";

import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";

type Plan = "Basic" | "Premium" | "Pro";

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] =
    useState<Plan>("Basic");

  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background"
  );

  const subscribe = () => {
    Alert.alert(
      "Subscription Successful",
      `You selected the ${selectedPlan} plan`
    );

    // Later:
    // Save to Firebase
    // Update Zustand Store
    // Call Stripe RevenueCat API
  };

  const cancelSubscription = () => {
    Alert.alert(
      "Subscription Cancelled",
      "Your subscription has been cancelled."
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">
        Subscriptions
      </ThemedText>

      <ThemedText>
        Choose a plan that matches your fitness
        goals.
      </ThemedText>

      <View style={styles.planContainer}>
        {["Basic", "Premium", "Pro"].map((plan) => (
          <Pressable
            key={plan}
            onPress={() =>
              setSelectedPlan(plan as Plan)
            }
            style={[
              styles.card,
              {
                backgroundColor: cardBg,
                borderColor:
                  selectedPlan === plan
                    ? "#4CAF50"
                    : "#D1D5DB",
              },
            ]}
          >
            <ThemedText type="defaultSemiBold">
              {plan}
            </ThemedText>

            <ThemedText>
              {plan === "Basic" &&
                "Workout tracking"}

              {plan === "Premium" &&
                "Workout tracking + nutrition"}

              {plan === "Pro" &&
                "Everything + coaching"}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={subscribe}
      >
        <ThemedText>
          Subscribe to {selectedPlan}
        </ThemedText>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={cancelSubscription}
      >
        <ThemedText>
          Cancel Subscription
        </ThemedText>
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ThemedText>
          Back to Profile
        </ThemedText>
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