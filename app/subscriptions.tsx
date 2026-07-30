import { router } from "expo-router";
import { useState } from "react";
import { 
  ActivityIndicator, 
  Alert, 
  Linking, 
  Pressable, 
  StyleSheet, 
  View 
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { initializePayment } from "@/services/paymentService";

<<<<<<< HEAD
type Plan = "Basic" | "Monthly Pro Plan (GHs 30)" | "Annual Pro Plan (GHs 250)";
=======
type PlanId = "basic" | "monthly" | "annual";
>>>>>>> 9416b65ff671e940e9b1d436f362a11b9121b7df

interface Plan {
  id: PlanId;
  title: string;
  description: string;
  amount: number; // 0 for basic, numeric GHS value for Paystack
}

const plans: Plan[] = [
  {
    id: "basic",
    title: "Basic",
    description: "Workout tracking",
    amount: 0,
  },
  {
    id: "monthly",
    title: "Monthly Pro Plan (GHs 30)",
    description: "Workout tracking + Unlimited AI access",
    amount: 30,
  },
  {
    id: "annual",
    title: "Annual Pro Plan (GHs 250)",
    description: "Keep your pro features for a year",
    amount: 250,
  },
];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [loading, setLoading] = useState(false);

  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background",
  );

  const subscribe = async () => {
    // 1. Basic / Free Plan logic
    if (selectedPlan.amount === 0) {
      Alert.alert("Plan Selected", "You are currently on the free Basic plan.");
      return;
    }

    setLoading(true);

    try {
      // 2. Request checkout URL from Spring Boot backend
      // Replace with logged-in user's email when user context is ready
      const response = await initializePayment({
        email: "user@example.com",
        amount: selectedPlan.amount,
      });

      // 3. Open Paystack authorization URL using React Native Linking
      if (response?.authorization_url) {
        const canOpen = await Linking.canOpenURL(response.authorization_url);
        if (canOpen) {
          await Linking.openURL(response.authorization_url);
        } else {
          Alert.alert("Error", "Unable to open checkout URL on this device.");
        }
      } else {
        Alert.alert("Payment Error", "Failed to retrieve checkout link from server.");
      }
    } catch (error) {
      console.error("Payment initialization failed:", error);
      Alert.alert("Connection Error", "Could not connect to the payment server. Make sure your Spring Boot backend is running.");
    } finally {
      setLoading(false);
    }
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
            onPress={() => setSelectedPlan(plan)}
            style={[
              styles.card,
              {
                backgroundColor: cardBg,
                borderColor: selectedPlan.id === plan.id ? "#007AFF" : "#D1D5DB",
              },
            ]}
          >
            <ThemedText type="defaultSemiBold">{plan.title}</ThemedText>
            <ThemedText>{plan.description}</ThemedText>
          </Pressable>
        ))}
      </View>

      <Pressable 
        style={[styles.primaryButton, loading && styles.disabledButton]} 
        onPress={subscribe}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.buttonText}>
            {selectedPlan.amount === 0 ? "Select Basic Plan" : `Subscribe (${selectedPlan.title})`}
          </ThemedText>
        )}
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={cancelSubscription}>
        <ThemedText style={styles.buttonText}>Cancel Subscription</ThemedText>
      </Pressable>

      <Pressable
        style={styles.backButton}
        onPress={() => router.replace("/(tabs)/profile")}
      >
        <ThemedText style={styles.buttonText}>Back to Profile</ThemedText>
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
  disabledButton: {
    opacity: 0.6,
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
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});