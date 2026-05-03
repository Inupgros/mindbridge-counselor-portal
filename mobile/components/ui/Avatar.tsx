import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface AvatarProps {
  initials: string;
  size?: number;
  color?: string;
}

const BG_COLORS = ["#155DFC", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#F97316"];

function colorFromInitials(initials: string): string {
  const code = initials.charCodeAt(0) + (initials.charCodeAt(1) || 0);
  return BG_COLORS[code % BG_COLORS.length];
}

export function Avatar({ initials, size = 40, color }: AvatarProps) {
  const bg = color ?? colorFromInitials(initials);
  const fontSize = size * 0.38;

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.text, { fontSize, color: "#fff" }]}>{initials.slice(0, 2).toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.5,
  },
});
