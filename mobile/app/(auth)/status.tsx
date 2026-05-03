import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";

const STEPS = [
  { key: "submitted", label: "Application Submitted", done: true },
  { key: "review", label: "Under Review", done: true },
  { key: "verification", label: "Document Verification", done: false },
  { key: "approval", label: "Final Approval", done: false },
];

export default function StatusScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const { login } = useAuth();

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleGoToDashboard = async () => {
    await login();
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: bottomPad + 20 }]}>
      <View style={styles.content}>
        {/* Status badge */}
        <View style={[styles.statusBadge, { backgroundColor: colors.warningLight }]}>
          <Feather name="clock" size={14} color={colors.warning} />
          <Text style={[styles.statusBadgeText, { color: colors.warning }]}>Under Review</Text>
        </View>

        {/* Icon */}
        <View style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
          <Feather name="file-text" size={36} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Application Submitted!</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>
          Your counselor profile is under review. We'll notify you once approved (usually 1–3 business days).
        </Text>

        {/* Progress tracker */}
        <View style={[styles.tracker, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {STEPS.map((step, i) => (
            <View key={step.key} style={styles.stepRow}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepDot, { backgroundColor: step.done ? colors.primary : colors.border }]}>
                  {step.done && <Feather name="check" size={10} color="#fff" />}
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[styles.stepLine, { backgroundColor: step.done ? colors.primary : colors.border }]} />
                )}
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepLabel, { color: step.done ? colors.text : colors.mutedForeground, fontFamily: step.done ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
                  {step.label}
                </Text>
                {step.done && <Text style={[styles.stepSub, { color: colors.success }]}>Complete</Text>}
                {!step.done && i === STEPS.findIndex((s) => !s.done) && (
                  <Text style={[styles.stepSub, { color: colors.warning }]}>In Progress</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.infoLight, borderColor: colors.info + "40" }]}>
          <Feather name="info" size={14} color={colors.info} />
          <Text style={[styles.infoText, { color: colors.infoForeground }]}>
            You'll receive an SMS and email notification when your status changes.
          </Text>
        </View>
      </View>

      {/* Demo shortcut */}
      <TouchableOpacity
        style={[styles.demoBtn, { backgroundColor: colors.primary }]}
        onPress={handleGoToDashboard}
        activeOpacity={0.85}
      >
        <Feather name="arrow-right" size={18} color="#fff" />
        <Text style={styles.demoBtnText}>Go to Dashboard (Demo)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  content: { flex: 1, alignItems: "center", paddingTop: 24 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginBottom: 28 },
  statusBadgeText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  iconCircle: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 20 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 10, textAlign: "center" },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22, marginBottom: 28, paddingHorizontal: 8 },
  tracker: { width: "100%", borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 20, gap: 0 },
  stepRow: { flexDirection: "row", gap: 14, minHeight: 44 },
  stepLeft: { alignItems: "center", width: 20 },
  stepDot: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  stepLine: { width: 2, flex: 1, marginTop: 4, borderRadius: 1 },
  stepContent: { flex: 1, paddingBottom: 16 },
  stepLabel: { fontSize: 14 },
  stepSub: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 2 },
  infoCard: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1, width: "100%", alignItems: "flex-start" },
  infoText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  demoBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 52, borderRadius: 14, marginHorizontal: 0, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  demoBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
