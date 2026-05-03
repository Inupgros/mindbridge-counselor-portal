import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accentColor?: string;
  icon: React.ReactNode;
  style?: ViewStyle;
}

export function StatCard({ label, value, sub, accentColor, icon, style }: StatCardProps) {
  const colors = useColors();
  const accent = accentColor ?? colors.primary;

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }, style]}>
      <View style={[styles.iconBox, { backgroundColor: accent + "18" }]}>
        {icon}
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      {sub && <Text style={[styles.sub, { color: accent }]}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    minWidth: 130,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  value: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  sub: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    marginTop: 4,
  },
});
