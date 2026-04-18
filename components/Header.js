import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.eyebrow}>USCIS Tracker</Text>
      <Text style={styles.title}>Case Dashboard</Text>
      <Text style={styles.subtitle}>
        Track progress, save cases, and review your timeline
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  eyebrow: {
    color: "#7ea6ff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
  },
  subtitle: {
    color: "#92a0ba",
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
  },
});