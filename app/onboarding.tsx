import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ONBOARDING_SEEN_KEY = "onboardingSeen";

const slides = [
  {
    icon: "📋",
    title: "Track Your Cases",
    body: "Enter your USCIS receipt number and get instant status updates",
  },
  {
    icon: "💾",
    title: "Save & Organize",
    body: "Save multiple cases and re-check them anytime",
  },
  {
    icon: "🤖",
    title: "AI Support",
    body: "Chat with AI for help understanding your case status",
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = useMemo(() => slides[currentSlide], [currentSlide]);
  const isLastSlide = currentSlide === slides.length - 1;

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "true");
    } catch (error) {
      console.log("[Onboarding] Failed to store onboarding state", error);
    } finally {
      router.replace("/(tabs)");
    }
  };

  const goNext = () => {
    if (isLastSlide) {
      void finishOnboarding();
      return;
    }

    setCurrentSlide((value) => value + 1);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right", "bottom"]}>
      <View style={styles.content}>
        <View style={styles.skipRow}>
          {!isLastSlide ? (
            <TouchableOpacity onPress={() => void finishOnboarding()}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>

        <View style={styles.heroCard}>
          <View style={styles.iconHalo}>
            <Text style={styles.icon}>{slide.icon}</Text>
          </View>

          <Text style={styles.eyebrow}>WELCOME TO CASETRACK USCIS</Text>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.body}>{slide.body}</Text>
        </View>

        <View style={styles.paginationRow}>
          {slides.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.paginationDot,
                index === currentSlide && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={goNext}>
          <Text style={styles.primaryButtonText}>
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07111f",
  },
  content: {
    flex: 1,
    padding: 24,
    paddingBottom: 36,
  },
  skipRow: {
    alignItems: "flex-end",
    minHeight: 28,
  },
  skipText: {
    color: "#8ba0bf",
    fontSize: 15,
    fontWeight: "600",
  },
  heroCard: {
    flex: 1,
    backgroundColor: "#0f1b2d",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#1b304f",
    padding: 28,
    justifyContent: "center",
    shadowColor: "#020817",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  iconHalo: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#132238",
    borderWidth: 1,
    borderColor: "#294777",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  icon: {
    fontSize: 42,
  },
  eyebrow: {
    color: "#6ea8ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 14,
  },
  body: {
    color: "#c7d5ea",
    fontSize: 16,
    lineHeight: 26,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 28,
    marginBottom: 24,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#32445f",
  },
  paginationDotActive: {
    width: 26,
    backgroundColor: "#3b82f6",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5f9bff",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
