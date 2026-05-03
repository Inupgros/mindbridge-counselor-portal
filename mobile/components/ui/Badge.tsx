import React from "react";
import { StyleSheet, Text, View } from "react-native";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "processing";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  default:    { bg: "#F1F5F9", text: "#475569" },
  success:    { bg: "#D1FAE5", text: "#065F46" },
  warning:    { bg: "#FEF3C7", text: "#92400E" },
  error:      { bg: "#FEE2E2", text: "#991B1B" },
  info:       { bg: "#DBEAFE", text: "#1E3A8A" },
  processing: { bg: "#EDE9FE", text: "#4C1D95" },
};

export function Badge({ label, variant = "default" }: BadgeProps) {
  const { bg, text } = VARIANT_STYLES[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.1,
  },
});
