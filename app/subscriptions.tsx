import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { PaystackCheckout } from "@/components/PayStackCheckout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { initializePayment } from "@/services/paymentService";

import { useAuthStore } from "@/stores/useAuthStore";

type PlanId = "basic" | "monthly" | "annual";

interface Plan {
  id: PlanId;
  title: string;
  description: string;
  amount: number; // 0 for basic, numeric GHS value for Paystack
}

const plans: Plan[] = [
  { id: "basic", title: "Basic", description: "Workout tracking", amount: 0 },
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
  const { user, updateProfile } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[0]);
  const [loading, setLoading] = useState(false);

  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null);

  const cardBg = useThemeColor(
    { light: "#F3F4F6", dark: "#2C2C2C" },
    "background",
  );

  const subscribe = async () => {
    if (selectedPlan.amount === 0) {
      updateProfile({ level: "Beginner" });
      Alert.alert("Plan Selected", "You are currently on the free Basic plan.");
      return;
    }

    setLoading(true);
    try {
      const email = user?.email || "user@example.com";
      const response = await initializePayment({
        email,
        amount: selectedPlan.amount,
      });

      if (response?.authorization_url) {
        setAuthorizationUrl(response.authorization_url);
        setCheckoutVisible(true);
      } else {
        Alert.alert(
          "Payment Error",
          "Failed to retrieve checkout link from server.",
        );
      }
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      const message = error?.message || "Could not initialize payment.";
      Alert.alert("Payment Error", message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutSuccess = async (reference: string | null) => {
    setCheckoutVisible(false);
    await updateProfile({ level: "Pro" });
    Alert.alert(
      "Payment Successful! 🎉",
      reference
        ? `Thank you for subscribing! Your Pro features are now unlocked. (Ref: ${reference})`
        : "Thank you for subscribing! Your Pro features are now unlocked.",
    );
  };

  const handleCheckoutCancel = () => {
    setCheckoutVisible(false);
  };

  const cancelSubscription = async () => {
    await updateProfile({ level: "Beginner" });
    Alert.alert(
      "Subscription Cancelled",
      "Your subscription has been cancelled and reset to Basic.",
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
                borderColor:
                  selectedPlan.id === plan.id ? "#007AFF" : "#D1D5DB",
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
            {selectedPlan.amount === 0
              ? "Select Basic Plan"
              : `Subscribe (${selectedPlan.title})`}
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

      <PaystackCheckout
        visible={checkoutVisible}
        authorizationUrl={authorizationUrl}
        onClose={() => setCheckoutVisible(false)}
        onSuccess={handleCheckoutSuccess}
        onCancel={handleCheckoutCancel}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  planContainer: { gap: 12 },
  card: { padding: 20, borderRadius: 16, borderWidth: 2 },
  primaryButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#4CAF50",
  },
  disabledButton: { opacity: 0.6 },
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
  buttonText: { color: "#FFFFFF", fontWeight: "600" },
});
