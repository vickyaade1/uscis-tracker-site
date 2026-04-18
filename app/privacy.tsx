import { Link } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DEFAULT_LANGUAGE, appText, t } from "../config/i18n";

export default function PrivacyScreen() {
  const language = DEFAULT_LANGUAGE;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.eyebrow}>{t(language, appText.helpLegal)}</Text>
        <Text style={styles.title}>{t(language, appText.privacyPolicy)}</Text>

        <View style={styles.card}>
          <Text style={styles.paragraph}>{t(language, appText.privacyIntro)}</Text>
          <Text style={styles.paragraph}>
            {t(language, appText.privacyReceiptNumbers)}
          </Text>
          <Text style={styles.paragraph}>{t(language, appText.privacyAnalytics)}</Text>
          <Text style={styles.paragraph}>{t(language, appText.privacyLegalAdvice)}</Text>
          <Text style={styles.noticeText}>{t(language, appText.privacyEditLater)}</Text>
        </View>

        <Link href="/support" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>
              {t(language, appText.openSupportScreen)}
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{t(language, appText.backToHome)}</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08101f",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  eyebrow: {
    color: "#60a5fa",
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#111c33",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  paragraph: {
    color: "#e2e8f0",
    lineHeight: 24,
    marginBottom: 14,
  },
  noticeText: {
    color: "#93c5fd",
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#111c33",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#e2e8f0",
    fontWeight: "700",
  },
});
