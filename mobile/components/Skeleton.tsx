import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = "100%", height = 16, borderRadius = 8, style }: SkeletonProps) {
  const colors = useColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        { height, borderRadius, backgroundColor: colors.border, width: width as number },
        animStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  const colors = useColors();
  return (
    <View style={[skStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={skStyles.row}>
        <Skeleton width={44} height={44} borderRadius={12} />
        <View style={skStyles.lines}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={11} />
        </View>
        <Skeleton width={56} height={22} borderRadius={10} />
      </View>
    </View>
  );
}

const skStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lines: {
    flex: 1,
    gap: 8,
  },
});
