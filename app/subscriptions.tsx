import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PaystackCheckout } from "@/components/PayStackCheckout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { initializePayment } from "@/services/paymentService";
import { useAuthStore } from "@/stores/useAuthStore";

const BLUE = "#2563EB";
const GREEN = "#10B981";
const PURPLE = "#7C3AED";

type PlanId = "basic" | "monthly" | "annual";

interface Plan {
  id: PlanId;
  title: string;
  subtitle: string;
  priceDisplay: string;
  billingPeriod: string;
  amount: number; // 0 for basic, numeric GHS value for Paystack
  popular?: boolean;
  savingsBadge?: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    id: "basic",
    title: "Basic",
    subtitle: "Essential tracking & community",
    priceDisplay: "GHs 0",
    billingPeriod: "Forever Free",
    amount: 0,
    features: [
      "Standard Workout Tracking",
      "Public Community & Guides",
      "Basic Profile & Streaks",
    ],
  },
  {
    id: "monthly",
    title: "Pro Monthly",
    subtitle: "Complete AI training suite",
    priceDisplay: "GHs 30",
    billingPeriod: "per month",
    amount: 30,
    features: [
      "Unlimited AI Fitness Coach Access",
      "Custom Workout & Nutrition Plans",
      "Unlimited Friend Messages & Chat",
      "Advanced Performance Analytics",
    ],
  },
  {
    id: "annual",
    title: "Pro Annual",
    subtitle: "Best value for dedicated athletes",
    priceDisplay: "GHs 250",
    billingPeriod: "per year",
    amount: 250,
    popular: true,
    savingsBadge: "SAVE 30%",
    features: [
      "Everything in Pro Monthly",
      "2 Months Free (Save GHs 110)",
      "Priority 24/7 Support",
      "Exclusive Masterclass Workout Videos",
    ],
  },
];

export default function SubscriptionScreen() {
  const { user, updateProfile } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PLANS[2]); // Default to Annual (Best Value)
  const [loading, setLoading] = useState(false);

  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null);

  const isPro = user?.level === "Pro" || user?.level === "Premium";

  const backgroundColor = useThemeColor({}, "background");
  const cardBg = useThemeColor(
    { light: "#FFFFFF", dark: "#1E293B" },
    "background"
  );
  const cardBorderColor = useThemeColor(
    { light: "#E2E8F0", dark: "#334155" },
    "icon"
  );
  const textColor = useThemeColor({}, "text");
  const mutedTextColor = useThemeColor(
    { light: "#64748B", dark: "#94A3B8" },
    "icon"
  );
  const chipBg = useThemeColor(
    { light: "#F1F5F9", dark: "#334155" },
    "background"
  );

  // 1. Initialize Paystack Payment
  const handleSubscribe = async () => {
    if (selectedPlan.amount === 0) {
      await updateProfile({ level: "Beginner" });
      Alert.alert("Plan Updated", "You are currently on the free Basic plan.");
      return;
    }

    setLoading(true);
    try {
      const userEmail = user?.email || "athlete@fitconnect.com";
      const response = await initializePayment({
        email: userEmail,
        amount: selectedPlan.amount,
      });

      if (response?.authorization_url) {
        setAuthorizationUrl(response.authorization_url);
        setCheckoutVisible(true);
      } else {
        Alert.alert(
          "Payment Error",
          "Unable to generate secure payment URL. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Payment initialization failed:", error);
      Alert.alert(
        "Payment Initialization Failed",
        error?.message || "Could not connect to payment gateway."
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Successful Payment
  const handleCheckoutSuccess = async (reference: string | null) => {
    setCheckoutVisible(false);
    await updateProfile({ level: "Pro" });
    Alert.alert(
      "Payment Successful! 🎉",
      reference
        ? `Welcome to FitConnect Pro! Your subscription reference is ${reference}.`
        : "Welcome to FitConnect Pro! All premium features are now unlocked."
    );
  };

  const handleCheckoutCancel = () => {
    setCheckoutVisible(false);
  };

  // 3. Cancel Active Subscription
  const handleCancelSubscription = async () => {
    Alert.alert(
      "Cancel Subscription?",
      "Are you sure you want to revert to the free Basic plan?",
      [
        { text: "Keep Pro", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            await updateProfile({ level: "Beginner" });
            Alert.alert(
              "Subscription Cancelled",
              "Your plan has been reset to Basic."
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace("/(tabs)/profile")}
          >
            <Ionicons name="arrow-back" size={20} color={BLUE} />
            <ThemedText style={styles.backBtnText}>Profile</ThemedText>
          </TouchableOpacity>

          <ThemedText type="title" style={styles.headerTitle}>
            Subscriptions
          </ThemedText>

          <View style={{ width: 60 }} />
        </View>

        {/* Current Active Plan Badge Banner */}
        <View
          style={[
            styles.activePlanBanner,
            { backgroundColor: isPro ? "#ECFDF5" : "#EFF6FF", borderColor: isPro ? GREEN : BLUE },
          ]}
        >
          <Ionicons
            name={isPro ? "ribbon-sharp" : "fitness-outline"}
            size={24}
            color={isPro ? GREEN : BLUE}
          />
          <View style={{ flex: 1 }}>
            <ThemedText style={{ fontSize: 12, color: mutedTextColor, fontWeight: "600" }}>
              CURRENT PLAN
            </ThemedText>
            <ThemedText style={{ fontSize: 16, fontWeight: "700", color: isPro ? GREEN : BLUE }}>
              {isPro ? "FitConnect Pro Member 🌟" : "FitConnect Basic (Free)"}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={[styles.subHeading, { color: mutedTextColor }]}>
          Unlock personalized AI coaching, unlimited friend chats, and advanced analytics.
        </ThemedText>

        {/* Plans Container */}
        <View style={styles.planContainer}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan.id === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                activeOpacity={0.9}
                onPress={() => setSelectedPlan(plan)}
                style={[
                  styles.card,
                  {
                    backgroundColor: cardBg,
                    borderColor: isSelected ? BLUE : cardBorderColor,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
              >
                {plan.popular ? (
                  <View style={styles.popularBadge}>
                    <ThemedText style={styles.popularBadgeText}>
                      MOST POPULAR
                    </ThemedText>
                  </View>
                ) : null}

                {plan.savingsBadge ? (
                  <View style={styles.savingsTag}>
                    <ThemedText style={styles.savingsTagText}>
                      {plan.savingsBadge}
                    </ThemedText>
                  </View>
                ) : null}

                <View style={styles.cardHeader}>
                  <View>
                    <ThemedText type="subtitle" style={styles.planTitle}>
                      {plan.title}
                    </ThemedText>
                    <ThemedText style={[styles.planSubtitle, { color: mutedTextColor }]}>
                      {plan.subtitle}
                    </ThemedText>
                  </View>
                  <View style={styles.radioOuter}>
                    {isSelected ? <View style={styles.radioInner} /> : null}
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <ThemedText style={styles.priceText}>{plan.priceDisplay}</ThemedText>
                  <ThemedText style={[styles.billingText, { color: mutedTextColor }]}>
                    / {plan.billingPeriod}
                  </ThemedText>
                </View>

                {/* Feature List */}
                <View style={styles.featureList}>
                  {plan.features.map((feature, idx) => (
                    <View key={idx} style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={isSelected ? GREEN : BLUE}
                      />
                      <ThemedText style={styles.featureText}>{feature}</ThemedText>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Payment Channels Info */}
        <View style={[styles.paymentBadge, { backgroundColor: chipBg }]}>
          <Ionicons name="lock-closed" size={16} color={mutedTextColor} />
          <ThemedText style={[styles.paymentBadgeText, { color: mutedTextColor }]}>
            Secured by Paystack • Supports MoMo (MTN, Telecel, AirtelTigo) & Cards
          </ThemedText>
        </View>

        {/* Main Subscribe Button */}
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.disabledButton]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonRow}>
              <Ionicons name="card-outline" size={20} color="#FFFFFF" />
              <ThemedText style={styles.primaryButtonText}>
                {selectedPlan.amount === 0
                  ? "Select Basic Plan"
                  : `Proceed to Pay (${selectedPlan.priceDisplay})`}
              </ThemedText>
            </View>
          )}
        </TouchableOpacity>

        {/* Cancel Subscription Option (Only if already Pro) */}
        {isPro ? (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelSubscription}
          >
            <ThemedText style={styles.cancelButtonText}>
              Cancel Pro Subscription
            </ThemedText>
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      {/* Paystack Webview Checkout Modal */}
      <PaystackCheckout
        visible={checkoutVisible}
        authorizationUrl={authorizationUrl}
        onClose={() => setCheckoutVisible(false)}
        onSuccess={handleCheckoutSuccess}
        onCancel={handleCheckoutCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    gap: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
    gap: 4,
  },
  backBtnText: {
    color: BLUE,
    fontWeight: "700",
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  activePlanBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  subHeading: {
    fontSize: 14,
    lineHeight: 20,
  },
  planContainer: {
    gap: 16,
    marginVertical: 4,
  },
  card: {
    padding: 18,
    borderRadius: 16,
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: 16,
    backgroundColor: PURPLE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
  savingsTag: {
    position: "absolute",
    top: 16,
    right: 50,
    backgroundColor: GREEN,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  savingsTagText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  planSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: BLUE,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BLUE,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginVertical: 10,
    gap: 4,
  },
  priceText: {
    fontSize: 26,
    fontWeight: "800",
    color: BLUE,
  },
  billingText: {
    fontSize: 14,
    fontWeight: "600",
  },
  featureList: {
    gap: 8,
    marginTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.08)",
    paddingTop: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    fontWeight: "500",
  },
  paymentBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    gap: 6,
  },
  paymentBadgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  primaryButton: {
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: BLUE,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FEE2E2",
  },
  cancelButtonText: {
    color: "#EF4444",
    fontWeight: "700",
    fontSize: 14,
  },
});

