import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  error?: string;
}

export function Input({ label, leftIcon, rightIcon, containerStyle, error, style, ...props }: InputProps) {
  const colors = useColors();

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      )}
      <View style={[styles.inputRow, { borderColor: error ? colors.destructive : colors.border, backgroundColor: colors.card }]}>
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: colors.text, fontFamily: "Inter_400Regular" },
            leftIcon ? styles.inputWithLeftIcon : undefined,
            rightIcon ? styles.inputWithRightIcon : undefined,
            style,
          ]}
          placeholderTextColor={colors.mutedForeground}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 14,
  },
  inputWithLeftIcon: {
    paddingLeft: 4,
  },
  inputWithRightIcon: {
    paddingRight: 4,
  },
  iconLeft: {
    paddingLeft: 14,
  },
  iconRight: {
    paddingRight: 14,
  },
  error: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
});
