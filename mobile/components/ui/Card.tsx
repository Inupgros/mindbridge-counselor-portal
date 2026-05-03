import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export function Card({ children, style, noPadding }: CardProps) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
        noPadding ? styles.noPadding : styles.withPadding,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  withPadding: {
    padding: 16,
  },
  noPadding: {
    padding: 0,
  },
});
