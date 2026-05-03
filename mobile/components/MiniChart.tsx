import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface DataPoint {
  month: string;
  amount: number;
}

interface MiniChartProps {
  data: DataPoint[];
  height?: number;
}

export function MiniChart({ data, height = 80 }: MiniChartProps) {
  const colors = useColors();
  const max = Math.max(...data.map((d) => d.amount), 1);

  return (
    <View style={[styles.container, { height: height + 24 }]}>
      <View style={[styles.bars, { height }]}>
        {data.map((point, i) => {
          const pct = point.amount / max;
          const isLast = i === data.length - 1;
          return (
            <View key={point.month} style={styles.barWrapper}>
              <View style={[styles.bar, { height: height * pct, backgroundColor: isLast ? colors.primary + "60" : colors.primary }]} />
              <Text style={[styles.label, { color: colors.mutedForeground }]}>{point.month}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-end",
  },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  bar: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  label: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
});
