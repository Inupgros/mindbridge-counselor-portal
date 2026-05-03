import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { Student, StudentStatus } from "@/constants/data";

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function statusVariant(status: StudentStatus): "success" | "warning" | "error" | "info" | "default" {
  switch (status) {
    case "active":  return "success";
    case "new":     return "info";
    case "pending": return "warning";
    case "denied":  return "error";
    default:        return "default";
  }
}

function statusLabel(status: StudentStatus): string {
  switch (status) {
    case "active":  return "Active";
    case "new":     return "New";
    case "pending": return "Pending";
    case "denied":  return "Denied";
  }
}

interface StudentRowProps {
  student: Student;
  onPress: () => void;
}

export function StudentRow({ student, onPress }: StudentRowProps) {
  const colors = useColors();
  return (
    <TouchableOpacity style={[styles.row, { backgroundColor: colors.card, borderBottomColor: colors.border }]} onPress={onPress} activeOpacity={0.7}>
      <Avatar initials={getInitials(student.name)} size={44} />
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{student.name}</Text>
        <Text style={[styles.meta, { color: colors.mutedForeground }]}>{student.school} · Grade {student.grade}</Text>
        {student.concerns.length > 0 && (
          <Text style={[styles.concerns, { color: colors.mutedForeground }]} numberOfLines={1}>{student.concerns.join(", ")}</Text>
        )}
      </View>
      <View style={styles.right}>
        <Badge label={statusLabel(student.status)} variant={statusVariant(student.status)} />
        <Text style={[styles.sessions, { color: colors.mutedForeground }]}>{student.sessionsCompleted} sessions</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  meta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  concerns: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    fontStyle: "italic",
  },
  right: {
    alignItems: "flex-end",
    gap: 4,
  },
  sessions: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
