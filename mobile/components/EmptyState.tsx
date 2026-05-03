import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message?: string;
}

export function EmptyState({ icon = "inbox", title, message }: EmptyStateProps) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
        <Feather name={icon} size={28} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message && <Text style={[styles.message, { color: colors.mutedForeground }]}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 10,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  message: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
});
