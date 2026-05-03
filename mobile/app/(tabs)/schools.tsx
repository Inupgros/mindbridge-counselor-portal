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
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/components/Toast";
import { useColors } from "@/hooks/useColors";
import { SCHOOLS, type School, type VisitStatus } from "@/constants/data";

type TabKey = "all" | "invites" | "visited" | "not_visited";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All Assigned" },
  { key: "invites", label: "Invites" },
  { key: "visited", label: "Visited" },
  { key: "not_visited", label: "Not Visited" },
];

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

function visitAccentColor(variant: "success" | "info" | "warning", colors: ReturnType<typeof useColors>): string {
  if (variant === "success") return colors.success;
  if (variant === "info") return colors.primary;
  return colors.warning;
}

// Mock pending invites
const PENDING_INVITES = [
  {
    id: "inv1",
    schoolName: "Kendriya Vidyalaya, Sector 8",
    city: "Dwarka, Delhi",
    board: "CBSE",
    studentCount: 1420,
    contact: "Mrs. Sunita Rao",
    phone: "+91 98110 23456",
    date: "2026-05-10",
    message: "We need career counselling support for Grade 11 & 12.",
  },
  {
    id: "inv2",
    schoolName: "Modern School, Barakhamba",
    city: "New Delhi",
    board: "CISCE",
    studentCount: 2100,
    contact: "Mr. Anil Verma",
    phone: "+91 98765 11223",
    date: "2026-05-12",
    message: "Requesting monthly sessions for our senior students.",
  },
];

interface InviteCardProps {
  invite: typeof PENDING_INVITES[0];
  index: number;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}

function InviteCard({ invite, index, onAccept, onDecline }: InviteCardProps) {
  const colors = useColors();
  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
      <View style={[styles.inviteCard, { backgroundColor: colors.card, borderColor: colors.primary + "40", borderLeftColor: colors.primary, borderLeftWidth: 3 }]}>
        <View style={styles.inviteHeader}>
          <View style={[styles.inviteIcon, { backgroundColor: colors.primaryLight }]}>
            <Feather name="mail" size={18} color={colors.primary} />
          </View>
          <View style={styles.inviteInfo}>
            <Text style={[styles.inviteSchool, { color: colors.text }]}>{invite.schoolName}</Text>
            <Text style={[styles.inviteMeta, { color: colors.mutedForeground }]}>{invite.city} · {invite.board} · {invite.studentCount.toLocaleString()} students</Text>
          </View>
          <Badge label="New Invite" variant="info" />
        </View>
        <View style={[styles.inviteMessage, { backgroundColor: colors.muted, borderRadius: 10 }]}>
          <Text style={[styles.inviteMessageText, { color: colors.textSecondary }]}>"{invite.message}"</Text>
        </View>
        <View style={styles.inviteContact}>
          <Feather name="user" size={12} color={colors.mutedForeground} />
          <Text style={[styles.inviteContactText, { color: colors.mutedForeground }]}>{invite.contact} · {invite.phone}</Text>
        </View>
        <View style={styles.inviteActions}>
          <TouchableOpacity
            style={[styles.inviteDeclineBtn, { borderColor: colors.border }]}
            onPress={() => onDecline(invite.id)}
            activeOpacity={0.8}
          >
            <Feather name="x" size={14} color={colors.mutedForeground} />
            <Text style={[styles.inviteDeclineText, { color: colors.mutedForeground }]}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.inviteAcceptBtn, { backgroundColor: colors.primary }]}
            onPress={() => onAccept(invite.id)}
            activeOpacity={0.85}
          >
            <Feather name="check" size={14} color="#fff" />
            <Text style={styles.inviteAcceptText}>Accept Invite</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

interface SchoolCardProps {
  school: School;
  index: number;
}

function SchoolCard({ school, index }: SchoolCardProps) {
  const colors = useColors();
  const pct = Math.round((school.visitsCompleted / school.visitsTotal) * 100);
  const variant = VISIT_VARIANT_MAP[school.visitStatus];
  const accent = visitAccentColor(variant, colors);
  const widthPct = `${pct}%` as const;

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).duration(400)}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.schoolIcon, { backgroundColor: colors.primaryLight }]}>
            <Feather name="book-open" size={20} color={colors.primary} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.cardName, { color: colors.text }]}>{school.name}</Text>
            <Text style={[styles.cardMeta, { color: colors.mutedForeground }]}>{school.city} · {school.board}</Text>
          </View>
          <Badge label={VISIT_LABEL_MAP[school.visitStatus]} variant={variant} />
        </View>

        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          {[
            { label: "Students", value: school.studentCount.toLocaleString() },
            { label: "Visits", value: `${school.visitsCompleted}/${school.visitsTotal}` },
            { label: "Progress", value: `${pct}%` },
          ].map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
          <View style={[styles.progressFill, { backgroundColor: accent, width: widthPct }]} />
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.contactRow}>
            <Feather name="user" size={12} color={colors.mutedForeground} />
            <Text style={[styles.contactText, { color: colors.mutedForeground }]}>{school.contactPrincipal}</Text>
          </View>
          {school.nextVisit !== "-" && (
            <View style={styles.contactRow}>
              <Feather name="calendar" size={12} color={colors.primary} />
              <Text style={[styles.nextVisitText, { color: colors.primary }]}>Next: {school.nextVisit}</Text>
            </View>
          )}
        </View>

        <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.cardAction, { borderRightWidth: 1, borderRightColor: colors.border }]}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activeOpacity={0.8}
          >
            <Feather name="phone" size={14} color={colors.primary} />
            <Text style={[styles.cardActionText, { color: colors.primary }]}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardAction}
            onPress={() => router.push({ pathname: "/school/[id]", params: { id: school.id } })}
            activeOpacity={0.8}
          >
            <Feather name="arrow-right" size={14} color={colors.primary} />
            <Text style={[styles.cardActionText, { color: colors.primary }]}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

export default function SchoolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [refreshing, setRefreshing] = useState(false);
  const [invites, setInvites] = useState(PENDING_INVITES);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); toast.show("School data refreshed", "info"); }, 1200);
  };

  const handleAccept = (id: string) => {
    setInvites((prev) => prev.filter((inv) => inv.id !== id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toast.show("School invite accepted! Added to your list.", "success");
  };

  const handleDecline = (id: string) => {
    setInvites((prev) => prev.filter((inv) => inv.id !== id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    toast.show("Invite declined", "warning");
  };

  const filteredSchools = SCHOOLS.filter((s) => {
    if (activeTab === "visited") return s.visitStatus === "completed";
    if (activeTab === "not_visited") return s.visitStatus === "not_scheduled";
    if (activeTab === "invites") return false;
    return true;
  });

  const totalCompleted = SCHOOLS.filter((s) => s.visitStatus === "completed").length;
  const totalScheduled = SCHOOLS.filter((s) => s.visitStatus === "scheduled").length;
  const totalVisitsDone = SCHOOLS.reduce((sum, s) => sum + s.visitsCompleted, 0);
  const totalVisitsTarget = SCHOOLS.reduce((sum, s) => sum + s.visitsTotal, 0);
  const compliancePct = Math.round((totalVisitsDone / totalVisitsTarget) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Schools</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.summaryStrip}>
          {[
            { label: "Assigned", value: String(SCHOOLS.length), color: colors.primary, bg: colors.primaryLight },
            { label: "Completed", value: String(totalCompleted), color: colors.success, bg: colors.successLight },
            { label: "Scheduled", value: String(totalScheduled), color: colors.info, bg: colors.infoLight },
            { label: "Compliance", value: `${compliancePct}%`, color: compliancePct >= 80 ? colors.success : colors.warning, bg: compliancePct >= 80 ? colors.successLight : colors.warningLight },
          ].map((item) => (
            <View key={item.label} style={[styles.summaryCard, { backgroundColor: item.bg }]}>
              <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[styles.summaryLabel, { color: item.color }]}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const badgeCount = tab.key === "invites" ? invites.length : 0;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabBtn, isActive && [styles.tabBtnActive, { borderBottomColor: colors.primary }]]}
              onPress={() => { setActiveTab(tab.key); Haptics.selectionAsync(); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabBtnText, { color: isActive ? colors.primary : colors.mutedForeground, fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
                {tab.label}
              </Text>
              {badgeCount > 0 && (
                <View style={[styles.tabBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.tabBadgeText}>{badgeCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Invite tab content */}
      {activeTab === "invites" ? (
        <FlatList
          data={invites}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <InviteCard invite={item} index={index} onAccept={handleAccept} onDecline={handleDecline} />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState icon="mail" title="No pending invites" message="You're all caught up on school invitations." />
          }
        />
      ) : (
        <FlatList
          data={filteredSchools}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <SchoolCard school={item} index={index} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState icon="book-open" title="No schools" message="No schools in this category." />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 12 },
  summaryStrip: { gap: 10, paddingVertical: 2 },
  summaryCard: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, alignItems: "center", minWidth: 90 },
  summaryValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  summaryLabel: { fontSize: 10, fontFamily: "Inter_500Medium", marginTop: 2 },
  tabsBar: { borderBottomWidth: 1, maxHeight: 48 },
  tabsContent: { paddingHorizontal: 16 },
  tabBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 14, paddingHorizontal: 8, marginRight: 8, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabBtnActive: { borderBottomWidth: 2 },
  tabBtnText: { fontSize: 12 },
  tabBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  tabBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold", color: "#fff" },
  listContent: { padding: 16, gap: 14, flexGrow: 1 },
  card: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  schoolIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  cardMeta: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  statsRow: { flexDirection: "row", borderTopWidth: 1, paddingVertical: 12, paddingHorizontal: 16 },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2 },
  progressTrack: { height: 4, marginHorizontal: 16, marginBottom: 14, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  cardFooter: { paddingHorizontal: 16, paddingBottom: 14, gap: 4 },
  contactRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  contactText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  nextVisitText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  cardActions: { flexDirection: "row", borderTopWidth: 1 },
  cardAction: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12 },
  cardActionText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  inviteCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", padding: 16, gap: 12 },
  inviteHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  inviteIcon: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  inviteInfo: { flex: 1 },
  inviteSchool: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 2 },
  inviteMeta: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 17 },
  inviteMessage: { padding: 12 },
  inviteMessageText: { fontSize: 12, fontFamily: "Inter_400Regular", fontStyle: "italic", lineHeight: 18 },
  inviteContact: { flexDirection: "row", alignItems: "center", gap: 6 },
  inviteContactText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  inviteActions: { flexDirection: "row", gap: 10 },
  inviteDeclineBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderWidth: 1.5, borderRadius: 12, height: 44 },
  inviteDeclineText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  inviteAcceptBtn: { flex: 2, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 12, height: 44 },
  inviteAcceptText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#fff" },
});
