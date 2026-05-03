import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
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
import { useColors } from "@/hooks/useColors";
import { APPOINTMENTS, PAYMENTS, STUDENTS } from "@/constants/data";

type ProfileTab = "career" | "appointments" | "payments" | "notes" | "followups";

const PROFILE_TABS: { key: ProfileTab; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: "career",       label: "Career",      icon: "trending-up" },
  { key: "appointments", label: "Sessions",    icon: "calendar" },
  { key: "payments",     label: "Payments",    icon: "dollar-sign" },
  { key: "notes",        label: "Notes",       icon: "file-text" },
  { key: "followups",    label: "Follow-ups",  icon: "check-square" },
];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const RIASEC_SCORES: Record<string, number[]> = {
  Investigative: [30, 85, 60, 45, 70, 40],
  Realistic:     [75, 50, 40, 60, 35, 55],
  Artistic:      [45, 60, 90, 35, 70, 50],
  Social:        [55, 40, 65, 80, 60, 45],
  Conventional:  [70, 55, 40, 65, 80, 50],
  Enterprising:  [60, 45, 55, 70, 85, 65],
};

const RIASEC_LABELS = ["R", "I", "A", "S", "E", "C"];

const RIASEC_DESCRIPTIONS: Record<string, string> = {
  Investigative: "Analytical thinker who excels in science, research, and systematic problem-solving.",
  Realistic:     "Hands-on learner who prefers practical, physical tasks and working with tools.",
  Artistic:      "Creative individual drawn to expressive work in arts, design, or writing.",
  Social:        "People-oriented and empathetic — thrives in teaching, counseling, or community work.",
  Conventional:  "Detail-oriented and organized, suited for data, finance, or administrative roles.",
  Enterprising:  "Natural leader with strong communication skills, suited for business and management.",
};

const SESSION_NOTES = [
  { date: "18 Apr 2026", session: "Session 3", text: "Student expressed significant stress over board exams. Discussed time management and breathing techniques. Recommended 15-min daily mindfulness. Follow-up next week." },
  { date: "4 Apr 2026", session: "Session 2", text: "Career goals clarified — interested in psychology and counseling. RIASEC confirmed as Investigative. Shared resource list on psychology colleges. Homework: research top 5 colleges." },
  { date: "12 Mar 2026", session: "Session 1", text: "Initial session. Student motivated but uncertain about career path. Family pressure to pursue engineering. Needs space to explore interests independently." },
];

interface FollowUp {
  id: string;
  title: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

const FOLLOW_UPS: FollowUp[] = [
  { id: "f1", title: "Research top 5 psychology colleges", dueDate: "8 May 2026", priority: "high", done: false },
  { id: "f2", title: "Complete RIASEC self-assessment worksheet", dueDate: "10 May 2026", priority: "high", done: false },
  { id: "f3", title: "Schedule parent meeting to discuss career path", dueDate: "15 May 2026", priority: "medium", done: false },
  { id: "f4", title: "Practice mindfulness breathing daily (15 min)", dueDate: "Ongoing", priority: "medium", done: true },
  { id: "f5", title: "Share college brochures with parents", dueDate: "12 May 2026", priority: "low", done: false },
];

const PRIORITY_COLOR: Record<FollowUp["priority"], string> = {
  high:   "#EF4444",
  medium: "#F59E0B",
  low:    "#3B82F6",
};

export default function StudentDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const { id } = useLocalSearchParams<{ id: string }>();
  const student = STUDENTS.find((s) => s.id === id);
  const [activeTab, setActiveTab] = useState<ProfileTab>("career");
  const [followUps, setFollowUps] = useState<FollowUp[]>(FOLLOW_UPS);

  if (!student) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Feather name="user-x" size={36} color={colors.mutedForeground} />
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>Student not found</Text>
        </View>
      </View>
    );
  }

  const studentAppts = APPOINTMENTS.filter((a) => a.studentId === student.id);
  const studentPayments = PAYMENTS.filter((p) => p.studentOrSchool === student.name);
  const riasecScores = RIASEC_SCORES[student.riasecType] ?? RIASEC_SCORES.Investigative;
  const maxScore = Math.max(...riasecScores, 1);

  const toggleFollowUp = (fuId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFollowUps((prev) =>
      prev.map((f) => (f.id === fuId ? { ...f, done: !f.done } : f))
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={[styles.hero, { paddingTop: topPad + 12, backgroundColor: colors.primary }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.heroContent}>
          <Avatar initials={getInitials(student.name)} size={72} color="rgba(255,255,255,0.25)" />
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{student.name}</Text>
            <Text style={styles.heroMeta}>{student.school} · Grade {student.grade}</Text>
            <View style={styles.heroTags}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>{student.board}</Text>
              </View>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>{student.riasecType}</Text>
              </View>
              <Badge
                label={student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                variant={student.status === "active" ? "success" : student.status === "new" ? "info" : "warning"}
              />
            </View>
          </View>
        </Animated.View>

        {/* Quick actions */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.quickActions}>
          {[
            { icon: "phone" as const, label: "Call Parent" },
            { icon: "calendar" as const, label: "Book Session" },
            { icon: "file-text" as const, label: "Report" },
          ].map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.quickAction}
              activeOpacity={0.8}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <View style={styles.quickActionIcon}>
                <Feather name={action.icon} size={16} color="#fff" />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </Animated.View>

      {/* Tab bar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabBarScroll, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        contentContainerStyle={styles.tabBarContent}
      >
        {PROFILE_TABS.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && [styles.tabActive, { borderBottomColor: colors.primary }]]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Feather name={tab.icon} size={13} color={active ? colors.primary : colors.mutedForeground} />
              <Text style={[
                styles.tabText,
                { color: active ? colors.primary : colors.mutedForeground, fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular" },
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 24 }]}
      >
        {/* ── CAREER ANALYSIS ── */}
        {activeTab === "career" && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.section}>
            {/* Academic info */}
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Academic Profile</Text>
              <View style={[styles.infoGrid, { borderColor: colors.border }]}>
                {[
                  { label: "Board", value: student.board },
                  { label: "Grade", value: student.grade },
                  { label: "Score", value: `${student.percentage}%` },
                  { label: "Age", value: `${student.age} years` },
                ].map((item) => (
                  <View key={item.label} style={[styles.infoCell, { borderColor: colors.border }]}>
                    <Text style={[styles.infoCellValue, { color: colors.text }]}>{item.value}</Text>
                    <Text style={[styles.infoCellLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </Card>

            {/* Concerns */}
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Presenting Concerns</Text>
              <View style={styles.concernsRow}>
                {student.concerns.map((c) => (
                  <View key={c} style={[styles.concernChip, { backgroundColor: colors.warningLight }]}>
                    <Text style={[styles.concernText, { color: colors.warningForeground }]}>{c}</Text>
                  </View>
                ))}
              </View>
            </Card>

            {/* RIASEC */}
            <Card style={styles.card}>
              <View style={styles.riasecHeader}>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>RIASEC Analysis</Text>
                  <Text style={[styles.cardSub, { color: colors.mutedForeground }]}>
                    Dominant: {student.riasecType}
                  </Text>
                </View>
                <View style={[styles.riasecBadge, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.riasecBadgeText, { color: colors.primary }]}>{student.riasecType[0]}</Text>
                </View>
              </View>
              <View style={styles.riasecBars}>
                {RIASEC_LABELS.map((label, i) => {
                  const heightPct = `${Math.round((riasecScores[i] / maxScore) * 100)}%` as const;
                  return (
                    <View key={label} style={styles.riasecBar}>
                      <View style={[styles.riasecTrack, { backgroundColor: colors.border }]}>
                        <View style={[styles.riasecFill, { backgroundColor: colors.primary, height: heightPct }]} />
                      </View>
                      <Text style={[styles.riasecLabel, { color: colors.mutedForeground }]}>{label}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={[styles.riasecDesc, { backgroundColor: colors.primaryLight }]}>
                <Text style={[styles.riasecDescText, { color: colors.primary }]}>
                  {RIASEC_DESCRIPTIONS[student.riasecType]}
                </Text>
              </View>
            </Card>

            {/* Parent info */}
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Parent / Guardian</Text>
              <View style={styles.parentRow}>
                <Avatar initials={getInitials(student.parentName)} size={44} />
                <View style={styles.parentInfo}>
                  <Text style={[styles.parentName, { color: colors.text }]}>{student.parentName}</Text>
                  <View style={styles.contactRow}>
                    <Feather name="phone" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.contactText, { color: colors.mutedForeground }]}>{student.parentPhone}</Text>
                  </View>
                  <View style={styles.contactRow}>
                    <Feather name="mail" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.contactText, { color: colors.mutedForeground }]}>{student.parentEmail}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.contactActions}>
                <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.primaryLight }]}>
                  <Feather name="phone" size={14} color={colors.primary} />
                  <Text style={[styles.contactBtnText, { color: colors.primary }]}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.contactBtn, { backgroundColor: colors.successLight }]}>
                  <Feather name="mail" size={14} color={colors.success} />
                  <Text style={[styles.contactBtnText, { color: colors.success }]}>Email</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>
        )}

        {/* ── SESSIONS ── */}
        {activeTab === "appointments" && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.section}>
            {studentAppts.length === 0 ? (
              <View style={styles.emptySection}>
                <Feather name="calendar" size={32} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No sessions yet</Text>
              </View>
            ) : studentAppts.map((appt) => (
              <Card key={appt.id} style={styles.apptCard}>
                <View style={styles.apptCardHeader}>
                  <Text style={[styles.apptCardDate, { color: colors.mutedForeground }]}>{appt.date}</Text>
                  <Badge
                    label={appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                    variant={appt.status === "completed" ? "success" : appt.status === "upcoming" ? "info" : "error"}
                  />
                </View>
                <Text style={[styles.apptCardType, { color: colors.text }]}>{appt.type}</Text>
                <View style={styles.apptCardMeta}>
                  <View style={styles.metaItem}>
                    <Feather name="clock" size={12} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{appt.time} · {appt.duration}min</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Feather name={appt.mode === "Online" ? "video" : "map-pin"} size={12} color={colors.mutedForeground} />
                    <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{appt.mode}</Text>
                  </View>
                </View>
                {appt.notes && <Text style={[styles.apptCardNotes, { color: colors.mutedForeground }]}>{appt.notes}</Text>}
              </Card>
            ))}
          </Animated.View>
        )}

        {/* ── PAYMENTS ── */}
        {activeTab === "payments" && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.section}>
            {studentPayments.length === 0 ? (
              <View style={styles.emptySection}>
                <Feather name="dollar-sign" size={32} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No payments yet</Text>
              </View>
            ) : studentPayments.map((payment) => (
              <Card key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentCardRow}>
                  <View style={styles.paymentCardInfo}>
                    <Text style={[styles.paymentCardDesc, { color: colors.text }]}>{payment.description}</Text>
                    <Text style={[styles.paymentCardDate, { color: colors.mutedForeground }]}>{payment.date}</Text>
                    <Text style={[styles.paymentCardInvoice, { color: colors.mutedForeground }]}>{payment.invoiceId}</Text>
                  </View>
                  <View style={styles.paymentCardRight}>
                    <Text style={[styles.paymentCardAmount, { color: colors.text }]}>₹{payment.amount.toLocaleString("en-IN")}</Text>
                    <Badge
                      label={payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      variant={payment.status === "received" ? "success" : payment.status === "pending" ? "warning" : "error"}
                    />
                  </View>
                </View>
              </Card>
            ))}
          </Animated.View>
        )}

        {/* ── SESSION NOTES ── */}
        {activeTab === "notes" && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.section}>
            {SESSION_NOTES.map((note, i) => (
              <Card key={i} style={styles.noteCard}>
                <View style={styles.noteHeader}>
                  <View style={styles.noteMeta}>
                    <Text style={[styles.noteSession, { color: colors.primary }]}>{note.session}</Text>
                    <Text style={[styles.noteDate, { color: colors.mutedForeground }]}>{note.date}</Text>
                  </View>
                  <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                    <Feather name="edit-3" size={14} color={colors.mutedForeground} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.noteText, { color: colors.text }]}>{note.text}</Text>
              </Card>
            ))}
            <TouchableOpacity
              style={[styles.addNoteBtn, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={[styles.addNoteBtnText, { color: colors.primary }]}>Add Session Note</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ── FOLLOW-UPS ── */}
        {activeTab === "followups" && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.section}>
            {/* Summary */}
            <View style={[styles.fuSummary, { backgroundColor: colors.primaryLight }]}>
              <View style={styles.fuSummaryItem}>
                <Text style={[styles.fuSummaryNum, { color: colors.primary }]}>
                  {followUps.filter((f) => !f.done).length}
                </Text>
                <Text style={[styles.fuSummaryLabel, { color: colors.primary }]}>Pending</Text>
              </View>
              <View style={[styles.fuSummaryDivider, { backgroundColor: colors.primary + "30" }]} />
              <View style={styles.fuSummaryItem}>
                <Text style={[styles.fuSummaryNum, { color: colors.success }]}>
                  {followUps.filter((f) => f.done).length}
                </Text>
                <Text style={[styles.fuSummaryLabel, { color: colors.success }]}>Completed</Text>
              </View>
            </View>

            {/* Follow-up items */}
            {followUps.map((fu) => (
              <TouchableOpacity
                key={fu.id}
                style={[
                  styles.fuRow,
                  {
                    backgroundColor: fu.done ? colors.successLight : colors.card,
                    borderColor: fu.done ? colors.success + "40" : colors.border,
                  },
                ]}
                onPress={() => toggleFollowUp(fu.id)}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.fuCheck,
                  {
                    backgroundColor: fu.done ? colors.success : "transparent",
                    borderColor: fu.done ? colors.success : colors.border,
                  },
                ]}>
                  {fu.done && <Feather name="check" size={12} color="#fff" />}
                </View>
                <View style={styles.fuInfo}>
                  <Text style={[
                    styles.fuTitle,
                    { color: fu.done ? colors.successForeground : colors.text, textDecorationLine: fu.done ? "line-through" : "none" },
                  ]}>
                    {fu.title}
                  </Text>
                  <View style={styles.fuMeta}>
                    <Feather name="clock" size={11} color={colors.mutedForeground} />
                    <Text style={[styles.fuDue, { color: colors.mutedForeground }]}>Due: {fu.dueDate}</Text>
                  </View>
                </View>
                <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLOR[fu.priority] }]} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.addNoteBtn, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={16} color={colors.primary} />
              <Text style={[styles.addNoteBtnText, { color: colors.primary }]}>Add Follow-up Task</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { padding: 8, alignSelf: "flex-start", marginBottom: 12 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  hero: { paddingHorizontal: 20, paddingBottom: 16 },
  heroContent: { flexDirection: "row", alignItems: "flex-start", gap: 16, marginBottom: 16 },
  heroInfo: { flex: 1, gap: 4 },
  heroName: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff" },
  heroMeta: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  heroTags: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  heroTag: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  heroTagText: { fontSize: 11, fontFamily: "Inter_500Medium", color: "#fff" },
  quickActions: { flexDirection: "row", gap: 12 },
  quickAction: { flex: 1, alignItems: "center", gap: 6 },
  quickActionIcon: { width: 44, height: 44, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, alignItems: "center", justifyContent: "center" },
  quickActionLabel: { fontSize: 11, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.85)" },
  tabBarScroll: { borderBottomWidth: 1 },
  tabBarContent: { paddingHorizontal: 8 },
  tab: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 14, paddingHorizontal: 12, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabActive: { borderBottomWidth: 2 },
  tabText: { fontSize: 12 },
  scroll: { padding: 16 },
  section: { gap: 14 },
  card: { gap: 12 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  cardSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", borderRadius: 12, overflow: "hidden", borderWidth: 1 },
  infoCell: { width: "50%", padding: 12, borderRightWidth: 0.5, borderBottomWidth: 0.5 },
  infoCellValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  infoCellLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  concernsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  concernChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  concernText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  riasecHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  riasecBadge: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  riasecBadgeText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  riasecBars: { flexDirection: "row", gap: 8, height: 80, alignItems: "flex-end" },
  riasecBar: { flex: 1, alignItems: "center", gap: 4, height: "100%" },
  riasecTrack: { flex: 1, width: "100%", borderRadius: 4, justifyContent: "flex-end", overflow: "hidden" },
  riasecFill: { width: "100%", borderRadius: 4 },
  riasecLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  riasecDesc: { padding: 12, borderRadius: 10, marginTop: 4 },
  riasecDescText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  parentRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  parentInfo: { flex: 1, gap: 4 },
  parentName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  contactText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  contactActions: { flexDirection: "row", gap: 10, marginTop: 4 },
  contactBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 10 },
  contactBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  emptySection: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  apptCard: { gap: 8 },
  apptCardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  apptCardDate: { fontSize: 12, fontFamily: "Inter_500Medium" },
  apptCardType: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  apptCardMeta: { flexDirection: "row", gap: 16 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  apptCardNotes: { fontSize: 12, fontFamily: "Inter_400Regular", fontStyle: "italic", lineHeight: 18 },
  paymentCard: {},
  paymentCardRow: { flexDirection: "row", gap: 12 },
  paymentCardInfo: { flex: 1, gap: 2 },
  paymentCardDesc: { fontSize: 13, fontFamily: "Inter_500Medium" },
  paymentCardDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  paymentCardInvoice: { fontSize: 11, fontFamily: "Inter_400Regular" },
  paymentCardRight: { alignItems: "flex-end", gap: 6 },
  paymentCardAmount: { fontSize: 15, fontFamily: "Inter_700Bold" },
  noteCard: { gap: 8 },
  noteHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  noteMeta: { gap: 2 },
  noteSession: { fontSize: 13, fontFamily: "Inter_700Bold" },
  noteDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  noteText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  addNoteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderWidth: 1.5, borderStyle: "dashed", borderRadius: 12, paddingVertical: 14 },
  addNoteBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  fuSummary: { flexDirection: "row", borderRadius: 14, padding: 16 },
  fuSummaryItem: { flex: 1, alignItems: "center", gap: 4 },
  fuSummaryNum: { fontSize: 24, fontFamily: "Inter_700Bold" },
  fuSummaryLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  fuSummaryDivider: { width: 1, marginHorizontal: 16 },
  fuRow: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderRadius: 14, padding: 14 },
  fuCheck: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  fuInfo: { flex: 1, gap: 4 },
  fuTitle: { fontSize: 13, fontFamily: "Inter_500Medium" },
  fuMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  fuDue: { fontSize: 11, fontFamily: "Inter_400Regular" },
  priorityDot: { width: 8, height: 8, borderRadius: 4 },
});
