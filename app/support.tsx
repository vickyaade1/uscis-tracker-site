import { Link } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { appText, t } from "../config/i18n";
import { getFontStyle } from "../config/typography";
import { useAppLanguage } from "../context/AppLanguageContext";

export default function SupportScreen() {
  const { language } = useAppLanguage();
  const regularText = getFontStyle(language, "regular");
  const mediumText = getFontStyle(language, "medium");
  const boldText = getFontStyle(language, "bold");

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.eyebrow, boldText]}>{t(language, appText.helpLegal)}</Text>
        <Text style={[styles.title, boldText]}>{t(language, appText.supportContact)}</Text>

        <View style={styles.card}>
          <Text style={[styles.paragraph, regularText]}>{t(language, appText.supportIntro)}</Text>

          <View style={styles.infoBlock}>
            <Text style={[styles.infoLabel, regularText]}>{t(language, appText.supportEmailLabel)}</Text>
            <Text style={[styles.infoValue, mediumText]}>{t(language, appText.supportEmailValue)}</Text>
          </View>

          <Text style={[styles.paragraph, regularText]}>
            {t(language, appText.supportResponseTime)}
          </Text>
          <Text style={[styles.paragraph, regularText]}>
            {t(language, appText.supportWhatToInclude)}
          </Text>
          <Text style={[styles.noticeText, mediumText]}>
            {t(language, appText.supportNotEmergency)}
          </Text>
        </View>

        <Link href="/privacy" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={[styles.secondaryButtonText, boldText]}>
              {t(language, appText.openPrivacyPolicy)}
            </Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={[styles.primaryButtonText, boldText]}>
              {t(language, appText.backToHome)}
            </Text>
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
  infoBlock: {
    backgroundColor: "#0b1324",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoLabel: {
    color: "#94a3b8",
    marginBottom: 6,
  },
  infoValue: {
    color: "#ffffff",
    fontWeight: "700",
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
