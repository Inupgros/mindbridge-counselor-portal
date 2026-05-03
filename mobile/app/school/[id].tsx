import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BottomSheet } from "@/components/BottomSheet";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/Toast";
import { useColors } from "@/hooks/useColors";
import { SCHOOLS, STUDENTS, type VisitStatus } from "@/constants/data";

const VISIT_VARIANT_MAP: Record<VisitStatus, "success" | "info" | "warning"> = {
  completed:     "success",
  scheduled:     "info",
  not_scheduled: "warning",
};
const VISIT_LABEL_MAP: Record<VisitStatus, string> = {
  completed:     "Completed",
  scheduled:     "Scheduled",
  not_scheduled: "Not Scheduled",
};

const VISIT_STEPS = [
  { label: "Visit Assigned", icon: "check-circle" as const },
  { label: "Scheduled", icon: "calendar" as const },
  { label: "In Progress", icon: "activity" as const },
  { label: "Completed", icon: "award" as const },
];

function stepIndex(status: VisitStatus): number {
  if (status === "not_scheduled") return 0;
  if (status === "scheduled") return 1;
  if (status === "completed") return 3;
  return 2;
}

export default function SchoolDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();

  const school = SCHOOLS.find((s) => s.id === id);
  const [showRequestSheet, setShowRequestSheet] = useState(false);
  const [requestDate, setRequestDate] = useState("");
  const [requestPurpose, setRequestPurpose] = useState("");
  const [showInviteSheet, setShowInviteSheet] = useState(false);

  if (!school) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Feather name="book-open" size={36} color={colors.mutedForeground} />
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>School not found</Text>
        </View>
      </View>
    );
  }

  const schoolStudents = STUDENTS.filter((s) => s.school === school.name);
  const variant = VISIT_VARIANT_MAP[school.visitStatus];
  const currentStep = stepIndex(school.visitStatus);
  const pct = Math.round((school.visitsCompleted / school.visitsTotal) * 100);
  const progressWidthPct = `${pct}%` as const;

  const handleRequestVisit = () => {
    setShowRequestSheet(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toast.show("Visit request submitted successfully!", "success");
  };

  const handleAcceptInvite = () => {
    setShowInviteSheet(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toast.show("School invite accepted!", "success");
  };

  const callSchool = () => {
    Linking.openURL(`tel:${school.contactPhone}`);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hero */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={[styles.hero, { paddingTop: topPad + 8, backgroundColor: colors.primary }]}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Animated.View entering={FadeInDown.delay(60).duration(400)} style={styles.heroContent}>
          <View style={styles.heroIcon}>
            <Feather name="book-open" size={28} color={colors.primary} />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{school.name}</Text>
            <Text style={styles.heroMeta}>{school.city} · {school.board}</Text>
            <View style={styles.heroRow}>
              <Badge label={VISIT_LABEL_MAP[school.visitStatus]} variant={variant} />
              <Text style={styles.heroStudents}>{school.studentCount.toLocaleString()} students</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick stats */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.heroStats}>
          {[
            { label: "Visits Done", value: `${school.visitsCompleted}/${school.visitsTotal}` },
            { label: "Progress", value: `${pct}%` },
            { label: "Assigned", value: school.assignedDate },
          ].map((stat) => (
            <View key={stat.label} style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{stat.value}</Text>
              <Text style={styles.heroStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Visit progress stepper */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Card style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Visit Progress</Text>
            <View style={styles.stepper}>
              {VISIT_STEPS.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <React.Fragment key={step.label}>
                    <View style={styles.stepItem}>
                      <View style={[
                        styles.stepCircle,
                        {
                          backgroundColor: done ? colors.success : colors.border,
                          borderColor: active ? colors.primary : "transparent",
                          borderWidth: active ? 2 : 0,
                        },
                      ]}>
                        <Feather name={step.icon} size={14} color={done ? "#fff" : colors.mutedForeground} />
                      </View>
                      <Text style={[styles.stepLabel, { color: done ? colors.text : colors.mutedForeground }]}>
                        {step.label}
                      </Text>
                    </View>
                    {i < VISIT_STEPS.length - 1 && (
                      <View style={[styles.stepLine, { backgroundColor: i < currentStep ? colors.success : colors.border }]} />
                    )}
                  </React.Fragment>
                );
              })}
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.success, width: progressWidthPct }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
              {school.visitsCompleted} of {school.visitsTotal} mandatory visits completed
            </Text>
          </Card>
        </Animated.View>

        {/* Visit timeline */}
        <Animated.View entering={FadeInDown.delay(140).duration(400)}>
          <Card style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Visit Timeline</Text>
            {[
              { label: "Assigned", value: school.assignedDate, icon: "calendar" as const, done: true },
              { label: "Last Visit", value: school.lastVisit === "-" ? "Not yet visited" : school.lastVisit, icon: "check-circle" as const, done: school.lastVisit !== "-" },
              { label: "Next Visit", value: school.nextVisit === "-" ? "Not scheduled" : school.nextVisit, icon: "clock" as const, done: false },
            ].map((item) => (
              <View key={item.label} style={styles.timelineRow}>
                <View style={[styles.timelineIcon, { backgroundColor: item.done ? colors.successLight : colors.muted }]}>
                  <Feather name={item.icon} size={14} color={item.done ? colors.success : colors.mutedForeground} />
                </View>
                <View style={styles.timelineInfo}>
                  <Text style={[styles.timelineLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
                  <Text style={[styles.timelineValue, { color: colors.text }]}>{item.value}</Text>
                </View>
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Contact */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Card style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>School Contact</Text>
            <View style={styles.contactRow}>
              <View style={[styles.contactAvatar, { backgroundColor: colors.primaryLight }]}>
                <Feather name="user" size={18} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={[styles.contactName, { color: colors.text }]}>{school.contactPrincipal}</Text>
                <Text style={[styles.contactRole, { color: colors.mutedForeground }]}>Principal</Text>
                <Text style={[styles.contactPhone, { color: colors.primary }]}>{school.contactPhone}</Text>
              </View>
            </View>
            <View style={styles.contactActions}>
              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: colors.primaryLight }]}
                onPress={callSchool}
                activeOpacity={0.8}
              >
                <Feather name="phone" size={14} color={colors.primary} />
                <Text style={[styles.contactBtnText, { color: colors.primary }]}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactBtn, { backgroundColor: colors.successLight }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toast.show("Message sent to principal", "success");
                }}
                activeOpacity={0.8}
              >
                <Feather name="message-circle" size={14} color={colors.success} />
                <Text style={[styles.contactBtnText, { color: colors.success }]}>Message</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>

        {/* Students at this school */}
        {schoolStudents.length > 0 && (
          <Animated.View entering={FadeInDown.delay(260).duration(400)}>
            <Card style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                My Students ({schoolStudents.length})
              </Text>
              {schoolStudents.map((student) => (
                <TouchableOpacity
                  key={student.id}
                  style={[styles.studentRow, { borderBottomColor: colors.border }]}
                  onPress={() => router.push(`/student/${student.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.studentInitials, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.initialsText, { color: colors.primary }]}>
                      {student.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={[styles.studentName, { color: colors.text }]}>{student.name}</Text>
                    <Text style={[styles.studentMeta, { color: colors.mutedForeground }]}>
                      Grade {student.grade} · {student.sessionsCompleted} sessions
                    </Text>
                  </View>
                  <Badge
                    label={student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                    variant={student.status === "active" ? "success" : student.status === "new" ? "info" : "warning"}
                  />
                </TouchableOpacity>
              ))}
            </Card>
          </Animated.View>
        )}

        {/* Action buttons */}
        <Animated.View entering={FadeInDown.delay(320).duration(400)} style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => setShowRequestSheet(true)}
            activeOpacity={0.85}
          >
            <Feather name="calendar" size={16} color="#fff" />
            <Text style={styles.actionBtnText}>Request Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtnSecondary, { borderColor: colors.primary, backgroundColor: colors.primaryLight }]}
            onPress={() => setShowInviteSheet(true)}
            activeOpacity={0.85}
          >
            <Feather name="user-check" size={16} color={colors.primary} />
            <Text style={[styles.actionBtnTextSecondary, { color: colors.primary }]}>Accept Invite</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Request Visit Bottom Sheet */}
      <BottomSheet
        visible={showRequestSheet}
        onClose={() => setShowRequestSheet(false)}
        title="Request School Visit"
        snapHeight={480}
      >
        <View style={styles.sheetBody}>
          <Input
            label="Preferred Visit Date"
            placeholder="e.g. 20 May 2026"
            value={requestDate}
            onChangeText={setRequestDate}
            leftIcon={<Feather name="calendar" size={16} color={colors.mutedForeground} />}
            containerStyle={styles.sheetField}
          />
          <Input
            label="Purpose / Agenda"
            placeholder="Career screening session, group workshop..."
            value={requestPurpose}
            onChangeText={setRequestPurpose}
            leftIcon={<Feather name="file-text" size={16} color={colors.mutedForeground} />}
            containerStyle={styles.sheetField}
          />
          <View style={[styles.sheetInfo, { backgroundColor: colors.infoLight }]}>
            <Feather name="info" size={14} color={colors.info} />
            <Text style={[styles.sheetInfoText, { color: colors.infoForeground }]}>
              Requests are sent to the school coordinator and typically confirmed within 48 hours.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.sheetBtn, { backgroundColor: colors.primary }]}
            onPress={handleRequestVisit}
            activeOpacity={0.85}
          >
            <Feather name="send" size={16} color="#fff" />
            <Text style={styles.sheetBtnText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>

      {/* Accept Invite Bottom Sheet */}
      <BottomSheet
        visible={showInviteSheet}
        onClose={() => setShowInviteSheet(false)}
        title="Accept School Invite"
        snapHeight={380}
      >
        <View style={styles.sheetBody}>
          <View style={[styles.inviteCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary + "30" }]}>
            <Feather name="mail" size={24} color={colors.primary} />
            <Text style={[styles.inviteTitle, { color: colors.text }]}>{school.name}</Text>
            <Text style={[styles.inviteText, { color: colors.mutedForeground }]}>
              You have a pending invite to conduct a career counseling program. This will add a new visit to your schedule.
            </Text>
          </View>
          <View style={styles.sheetRow}>
            <TouchableOpacity
              style={[styles.sheetBtnOutline, { borderColor: colors.destructive }]}
              onPress={() => setShowInviteSheet(false)}
              activeOpacity={0.85}
            >
              <Text style={[styles.sheetBtnOutlineText, { color: colors.destructive }]}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sheetBtnFlex, { backgroundColor: colors.primary }]}
              onPress={handleAcceptInvite}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetBtnText}>Accept Invite</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { padding: 8, alignSelf: "flex-start", marginBottom: 12 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 16, fontFamily: "Inter_400Regular" },
  hero: { paddingHorizontal: 20, paddingBottom: 16 },
  heroContent: { flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 16 },
  heroIcon: { width: 60, height: 60, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  heroInfo: { flex: 1, gap: 4 },
  heroName: { fontSize: 20, fontFamily: "Inter_700Bold", color: "#fff" },
  heroMeta: { fontSize: 13, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.75)" },
  heroRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  heroStudents: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.8)" },
  heroStats: { flexDirection: "row" },
  heroStat: { flex: 1, alignItems: "center" },
  heroStatValue: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },
  heroStatLabel: { fontSize: 10, fontFamily: "Inter_400Regular", color: "rgba(255,255,255,0.7)", marginTop: 2 },
  scroll: { padding: 16, gap: 16 },
  card: { gap: 12 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  stepper: { flexDirection: "row", alignItems: "center" },
  stepItem: { alignItems: "center", gap: 6, flex: 1 },
  stepCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  stepLabel: { fontSize: 10, fontFamily: "Inter_500Medium", textAlign: "center" },
  stepLine: { height: 2, flex: 1, marginBottom: 22 },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressText: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
  timelineRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  timelineIcon: { width: 36, height: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  timelineInfo: { flex: 1 },
  timelineLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  timelineValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  contactAvatar: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  contactInfo: { flex: 1, gap: 2 },
  contactName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  contactRole: { fontSize: 12, fontFamily: "Inter_400Regular" },
  contactPhone: { fontSize: 13, fontFamily: "Inter_500Medium" },
  contactActions: { flexDirection: "row", gap: 10 },
  contactBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 11, borderRadius: 12 },
  contactBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  studentRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 12, borderBottomWidth: 1 },
  studentInitials: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  initialsText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  studentInfo: { flex: 1 },
  studentName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  studentMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  actions: { gap: 10 },
  actionBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 14, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  actionBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
  actionBtnSecondary: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 50, borderRadius: 14, borderWidth: 1.5 },
  actionBtnTextSecondary: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  sheetBody: { gap: 14 },
  sheetField: { marginBottom: 4 },
  sheetInfo: { flexDirection: "row", gap: 10, padding: 12, borderRadius: 12, alignItems: "flex-start" },
  sheetInfoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  sheetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 14 },
  sheetBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
  sheetRow: { flexDirection: "row", gap: 10 },
  sheetBtnOutline: { flex: 1, height: 50, borderRadius: 14, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  sheetBtnOutlineText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  sheetBtnFlex: { flex: 2, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  inviteCard: { alignItems: "center", gap: 10, borderRadius: 16, padding: 20, borderWidth: 1, marginBottom: 4 },
  inviteTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  inviteText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
});
