import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BottomSheet } from "@/components/BottomSheet";
import { MiniChart } from "@/components/MiniChart";
import { SectionHeader } from "@/components/SectionHeader";
import { StatCard } from "@/components/StatCard";
import { useToast } from "@/components/Toast";
import { useColors } from "@/hooks/useColors";
import { APPOINTMENTS, MONTHLY_REVENUE, SCHOOLS, STUDENTS } from "@/constants/data";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

type VisitVariant = "success" | "info" | "warning";
function visitVariant(status: string): VisitVariant {
  if (status === "completed") return "success";
  if (status === "scheduled") return "info";
  return "warning";
}
function visitLabel(status: string): string {
  if (status === "completed") return "Completed";
  if (status === "scheduled") return "Scheduled";
  return "Not Scheduled";
}
function visitAccentColor(variant: VisitVariant, colors: ReturnType<typeof useColors>): string {
  if (variant === "success") return colors.success;
  if (variant === "info") return colors.primary;
  return colors.warning;
}

const SESSION_TYPES = ["Career Counseling", "Mental Health", "Academic Coaching", "Follow-up"] as const;
const ACTIVITY = [
  { icon: "user-check" as const, text: "Rohit Kumar session completed", time: "2h ago", color: "#10B981" },
  { icon: "dollar-sign" as const, text: "₹8,000 received from DPS Rohini", time: "5h ago", color: "#F59E0B" },
  { icon: "user-plus" as const, text: "New referral: Rahul Gupta", time: "Yesterday", color: "#155DFC" },
  { icon: "calendar" as const, text: "Meera Singh session rescheduled", time: "Yesterday", color: "#64748B" },
];

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [showStartSession, setShowStartSession] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedType, setSelectedType] = useState<typeof SESSION_TYPES[number]>("Career Counseling");

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); toast.show("Dashboard refreshed", "info"); }, 1200);
  };

  const handleStartSession = () => {
    setShowStartSession(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toast.show("Session started! Timer running.", "success");
  };

  const newStudents = STUDENTS.filter((s) => s.status === "new");
  const upcomingAppts = APPOINTMENTS.filter((a) => a.status === "upcoming").slice(0, 3);
  const activeStudents = STUDENTS.filter((s) => s.status === "active").length;
  const totalRevenue = MONTHLY_REVENUE.reduce((sum, m) => sum + m.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}
      >
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good morning,</Text>
          <Text style={[styles.name, { color: colors.text }]}>Dr. Ananya Sharma</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: colors.primaryLight }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          >
            <Feather name="bell" size={18} color={colors.primary} />
            <View style={[styles.notifDot, { backgroundColor: colors.warning }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <Avatar initials="AS" size={40} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scroll}
      >
        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.statsRow}>
          <StatCard label="Active" value={String(activeStudents)} sub="+2 this week" icon={<Feather name="users" size={18} color={colors.primary} />} accentColor={colors.primary} style={styles.statCard} />
          <StatCard label="Sessions" value="8" sub="This week" icon={<Feather name="calendar" size={18} color={colors.success} />} accentColor={colors.success} style={styles.statCard} />
          <StatCard label="Payout" value="₹14.2k" sub="5 May 2026" icon={<Feather name="dollar-sign" size={18} color={colors.warning} />} accentColor={colors.warning} style={styles.statCard} />
        </Animated.View>

        {/* Revenue Chart */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.section}>
          <Card noPadding>
            <View style={[styles.chartTop, { borderBottomColor: colors.border }]}>
              <View>
                <Text style={[styles.chartTitle, { color: colors.text }]}>Revenue Trend</Text>
                <Text style={[styles.chartSub, { color: colors.mutedForeground }]}>Jan–May 2026</Text>
              </View>
              <View style={styles.chartTotalBox}>
                <Text style={[styles.chartTotal, { color: colors.primary }]}>₹{(totalRevenue / 1000).toFixed(0)}k</Text>
                <Text style={[styles.chartTotalSub, { color: colors.mutedForeground }]}>YTD</Text>
              </View>
            </View>
            <View style={styles.chartPad}>
              <MiniChart data={MONTHLY_REVENUE} height={72} />
            </View>
          </Card>
        </Animated.View>

        {/* School visits */}
        <Animated.View entering={FadeInDown.delay(180).duration(400)} style={styles.section}>
          <SectionHeader title="School Visits" action="View all" onAction={() => router.push("/(tabs)/schools")} />
          <View style={{ gap: 10 }}>
            {SCHOOLS.map((school) => {
              const pct = Math.round((school.visitsCompleted / school.visitsTotal) * 100);
              const variant = visitVariant(school.visitStatus);
              const label = visitLabel(school.visitStatus);
              const accentCol = visitAccentColor(variant, colors);
              const widthPct = `${pct}%` as const;
              return (
                <TouchableOpacity
                  key={school.id}
                  style={[styles.schoolRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => router.push({ pathname: "/school/[id]", params: { id: school.id } })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.schoolAccent, { backgroundColor: accentCol }]} />
                  <View style={styles.schoolInfo}>
                    <View style={styles.schoolTop}>
                      <Text style={[styles.schoolName, { color: colors.text }]}>{school.name}</Text>
                      <Badge label={label} variant={variant} />
                    </View>
                    <Text style={[styles.schoolMeta, { color: colors.mutedForeground }]}>
                      {school.board} · {school.visitsCompleted}/{school.visitsTotal} visits · {pct}%
                    </Text>
                    <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                      <View style={[styles.progressFill, { backgroundColor: accentCol, width: widthPct }]} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* New Requests */}
        {newStudents.length > 0 && (
          <Animated.View entering={FadeInDown.delay(240).duration(400)} style={styles.section}>
            <SectionHeader title="New Requests" action={`${newStudents.length} pending`} onAction={() => router.push("/(tabs)/students")} />
            <Card noPadding>
              {newStudents.map((student, idx) => (
                <View key={student.id}>
                  <TouchableOpacity
                    style={styles.requestRow}
                    onPress={() => router.push({ pathname: "/student/[id]", params: { id: student.id } })}
                    activeOpacity={0.8}
                  >
                    <Avatar initials={getInitials(student.name)} size={40} />
                    <View style={styles.requestInfo}>
                      <Text style={[styles.requestName, { color: colors.text }]}>{student.name}</Text>
                      <Text style={[styles.requestMeta, { color: colors.mutedForeground }]}>{student.school} · {student.concerns.join(", ")}</Text>
                    </View>
                    <View style={styles.requestActions}>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.successLight }]} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
                        <Feather name="check" size={14} color={colors.success} />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.destructiveLight }]} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
                        <Feather name="x" size={14} color={colors.destructive} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                  {idx < newStudents.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                </View>
              ))}
            </Card>
          </Animated.View>
        )}

        {/* Upcoming Appointments */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
          <SectionHeader title="Today's Schedule" action="Full calendar" onAction={() => router.push("/(tabs)/appointments")} />
          <View style={{ gap: 10 }}>
            {upcomingAppts.map((appt) => (
              <TouchableOpacity
                key={appt.id}
                style={[styles.apptRow, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.push("/(tabs)/appointments")}
                activeOpacity={0.8}
              >
                <View style={[styles.apptTime, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.apptTimeText, { color: colors.primary }]}>{appt.time.split(" ")[0]}</Text>
                  <Text style={[styles.apptTimePeriod, { color: colors.primary }]}>{appt.time.split(" ")[1]}</Text>
                </View>
                <View style={styles.apptInfo}>
                  <Text style={[styles.apptName, { color: colors.text }]}>{appt.studentName}</Text>
                  <Text style={[styles.apptMeta, { color: colors.mutedForeground }]}>{appt.type} · {appt.mode} · {appt.duration}min</Text>
                </View>
                <TouchableOpacity
                  style={[styles.startBtn, { backgroundColor: colors.success }]}
                  onPress={() => { setSelectedStudentId(appt.studentId); setShowStartSession(true); }}
                  activeOpacity={0.85}
                >
                  <Feather name="play" size={12} color="#fff" />
                  <Text style={styles.startBtnText}>Start</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            {upcomingAppts.length === 0 && (
              <View style={[styles.emptyAppt, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="calendar" size={20} color={colors.mutedForeground} />
                <Text style={[styles.emptyApptText, { color: colors.mutedForeground }]}>No upcoming sessions today</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View entering={FadeInDown.delay(360).duration(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
          <Card noPadding>
            {ACTIVITY.map((item, i) => (
              <View key={i} style={[styles.activityRow, { borderBottomColor: colors.border, borderBottomWidth: i < ACTIVITY.length - 1 ? 1 : 0 }]}>
                <View style={[styles.activityIcon, { backgroundColor: item.color + "20" }]}>
                  <Feather name={item.icon} size={14} color={item.color} />
                </View>
                <Text style={[styles.activityText, { color: colors.text }]}>{item.text}</Text>
                <Text style={[styles.activityTime, { color: colors.mutedForeground }]}>{item.time}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>

        <View style={{ height: 96 }} />
      </ScrollView>

      {/* Start Session FAB */}
      <Animated.View entering={FadeInDown.delay(500).duration(400)} style={[styles.fab, { bottom: Platform.OS === "web" ? 90 : insets.bottom + 80 }]}>
        <TouchableOpacity
          style={[styles.fabBtn, { backgroundColor: colors.primary }]}
          onPress={() => setShowStartSession(true)}
          activeOpacity={0.85}
        >
          <Feather name="play" size={20} color="#fff" />
          <Text style={styles.fabText}>Start Session</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Start Session Bottom Sheet */}
      <BottomSheet
        visible={showStartSession}
        onClose={() => setShowStartSession(false)}
        title="Start Session"
        snapHeight={420}
      >
        <View style={styles.sheetBody}>
          <Text style={[styles.sheetLabel, { color: colors.text }]}>Select Student</Text>
          <ScrollView style={styles.sheetStudentList} showsVerticalScrollIndicator={false}>
            {STUDENTS.filter((s) => s.status === "active").map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.sheetStudentRow,
                  {
                    backgroundColor: selectedStudentId === s.id ? colors.primaryLight : colors.background,
                    borderColor: selectedStudentId === s.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelectedStudentId(s.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.sheetInitials, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.sheetInitialsText, { color: colors.primary }]}>
                    {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.sheetStudentInfo}>
                  <Text style={[styles.sheetStudentName, { color: colors.text }]}>{s.name}</Text>
                  <Text style={[styles.sheetStudentMeta, { color: colors.mutedForeground }]}>{s.school}</Text>
                </View>
                {selectedStudentId === s.id && <Feather name="check" size={16} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={[styles.sheetLabel, { color: colors.text }]}>Session Type</Text>
          <View style={styles.typeGrid}>
            {SESSION_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.typeChip, { borderColor: selectedType === t ? colors.primary : colors.border, backgroundColor: selectedType === t ? colors.primaryLight : colors.background }]}
                onPress={() => setSelectedType(t)}
                activeOpacity={0.8}
              >
                <Text style={[styles.typeChipText, { color: selectedType === t ? colors.primary : colors.mutedForeground }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.sheetBtn, { backgroundColor: colors.success }]}
            onPress={handleStartSession}
            activeOpacity={0.85}
          >
            <Feather name="play" size={16} color="#fff" />
            <Text style={styles.sheetBtnText}>Start Session Now</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  headerLeft: { gap: 2 },
  greeting: { fontSize: 12, fontFamily: "Inter_400Regular" },
  name: { fontSize: 18, fontFamily: "Inter_700Bold" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  notifBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  notifDot: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: "#fff" },
  scroll: { paddingHorizontal: 16, paddingTop: 16 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: { flex: 1 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 10 },
  chartTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1 },
  chartTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  chartSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  chartTotalBox: { alignItems: "flex-end" },
  chartTotal: { fontSize: 20, fontFamily: "Inter_700Bold" },
  chartTotalSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  chartPad: { padding: 16 },
  schoolRow: { borderRadius: 14, borderWidth: 1, flexDirection: "row", overflow: "hidden" },
  schoolAccent: { width: 4 },
  schoolInfo: { flex: 1, padding: 14, gap: 6 },
  schoolTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  schoolName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  schoolMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  progressTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  requestRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  requestInfo: { flex: 1 },
  requestName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  requestMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  requestActions: { flexDirection: "row", gap: 8 },
  actionBtn: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  divider: { height: 1, marginHorizontal: 14 },
  apptRow: { borderRadius: 14, borderWidth: 1, flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  apptTime: { width: 56, height: 56, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  apptTimeText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  apptTimePeriod: { fontSize: 10, fontFamily: "Inter_500Medium" },
  apptInfo: { flex: 1 },
  apptName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  apptMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  startBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  startBtnText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#fff" },
  emptyAppt: { flexDirection: "row", alignItems: "center", gap: 10, padding: 16, borderRadius: 14, borderWidth: 1 },
  emptyApptText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  activityRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  activityIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  activityText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  activityTime: { fontSize: 11, fontFamily: "Inter_400Regular" },
  fab: { position: "absolute", alignSelf: "center", right: 16 },
  fabBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 28, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  fabText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
  sheetBody: { gap: 12 },
  sheetLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sheetStudentList: { maxHeight: 160 },
  sheetStudentRow: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderRadius: 12, padding: 10, marginBottom: 6 },
  sheetInitials: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  sheetInitialsText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  sheetStudentInfo: { flex: 1 },
  sheetStudentName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sheetStudentMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  typeChip: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  typeChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sheetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 14 },
  sheetBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
