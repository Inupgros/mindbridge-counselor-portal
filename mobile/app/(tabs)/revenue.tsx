import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
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
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BottomSheet } from "@/components/BottomSheet";
import { MiniChart } from "@/components/MiniChart";
import { useToast } from "@/components/Toast";
import { useColors } from "@/hooks/useColors";
import { COUNSELOR, MONTHLY_REVENUE, PAYMENTS, type Payment, type PaymentStatus } from "@/constants/data";

const PAYMENT_VARIANT_MAP: Record<PaymentStatus, "success" | "warning" | "error" | "info"> = {
  received:   "success",
  pending:    "warning",
  overdue:    "error",
  processing: "info",
};

function paymentVariant(status: PaymentStatus): "success" | "warning" | "error" | "info" {
  return PAYMENT_VARIANT_MAP[status];
}

const PAYMENT_LABEL_MAP: Record<PaymentStatus, string> = {
  received:   "Received",
  pending:    "Pending",
  overdue:    "Overdue",
  processing: "Processing",
};

function paymentLabel(status: PaymentStatus): string {
  return PAYMENT_LABEL_MAP[status];
}

function fmt(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

interface PaymentCardProps {
  payment: Payment;
  expanded: boolean;
  onToggle: () => void;
  onDownload: () => void;
}

function PaymentCard({ payment, expanded, onToggle, onDownload }: PaymentCardProps) {
  const colors = useColors();
  const isSchoolVisit = payment.type === "school_visit";
  const iconName: keyof typeof import("@expo/vector-icons").Feather.glyphMap = isSchoolVisit ? "book-open" : "user";
  const iconBg = isSchoolVisit ? colors.primaryLight : colors.successLight;
  const iconColor = isSchoolVisit ? colors.primary : colors.success;

  return (
    <View style={[styles.paymentCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity style={styles.paymentRow} onPress={onToggle} activeOpacity={0.8}>
        <View style={[styles.paymentIcon, { backgroundColor: iconBg }]}>
          <Feather name={iconName} size={16} color={iconColor} />
        </View>
        <View style={styles.paymentInfo}>
          <Text style={[styles.paymentName, { color: colors.text }]}>{payment.studentOrSchool}</Text>
          <Text style={[styles.paymentDesc, { color: colors.mutedForeground }]} numberOfLines={expanded ? undefined : 1}>
            {payment.description}
          </Text>
          <Text style={[styles.paymentDate, { color: colors.mutedForeground }]}>{payment.date}</Text>
        </View>
        <View style={styles.paymentRight}>
          <Text style={[styles.paymentAmount, { color: colors.text }]}>{fmt(payment.amount)}</Text>
          <Badge label={paymentLabel(payment.status)} variant={paymentVariant(payment.status)} />
        </View>
        <Feather name={expanded ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
      </TouchableOpacity>

      {expanded && (
        <Animated.View entering={FadeIn.duration(200)} style={[styles.paymentDetail, { borderTopColor: colors.border }]}>
          {[
            { label: "Payment Type", value: isSchoolVisit ? "School Visit" : "Individual Session" },
            { label: "Reference ID", value: `TXN-${payment.id.padStart(6, "0")}` },
            { label: "Gross Amount", value: fmt(Math.round(payment.amount / 0.88)) },
            { label: "Platform Fee (12%)", value: `-${fmt(Math.round(payment.amount / 0.88 * 0.12))}` },
            { label: "Net Received", value: fmt(payment.amount) },
          ].map((row) => (
            <View key={row.label} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{row.value}</Text>
            </View>
          ))}
          <View style={styles.detailActions}>
            <TouchableOpacity
              style={[styles.downloadBtn, { backgroundColor: colors.primaryLight }]}
              onPress={onDownload}
              activeOpacity={0.8}
            >
              <Feather name="download" size={14} color={colors.primary} />
              <Text style={[styles.downloadBtnText, { color: colors.primary }]}>Download Invoice</Text>
            </TouchableOpacity>
            {payment.status === "pending" && (
              <TouchableOpacity style={[styles.remindBtn, { borderColor: colors.border }]} activeOpacity={0.8}>
                <Feather name="bell" size={14} color={colors.mutedForeground} />
                <Text style={[styles.remindBtnText, { color: colors.mutedForeground }]}>Send Reminder</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}
    </View>
  );
}

export default function RevenueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const toast = useToast();

  const [payoutRequested, setPayoutRequested] = useState(false);
  const [showPayoutSheet, setShowPayoutSheet] = useState(false);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.show("Payments refreshed", "info");
    }, 1200);
  };

  const handleDownload = (payment: Payment) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toast.show(`Invoice for ${payment.studentOrSchool} downloaded`, "success");
  };

  const handleRequestPayout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPayoutRequested(true);
    setShowPayoutSheet(false);
    toast.show("Early payout request submitted!", "success");
  };

  const totalRevenue = PAYMENTS.reduce((s, p) => s + p.amount, 0);
  const totalReceived = PAYMENTS.filter((p) => p.status === "received").reduce((s, p) => s + p.amount, 0);
  const totalPending = PAYMENTS.filter((p) => p.status === "pending" || p.status === "processing").reduce((s, p) => s + p.amount, 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.primary }]}>
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={styles.headerLabel}>Total Earnings (YTD)</Text>
          <Text style={styles.headerAmount}>{fmt(totalRevenue)}</Text>
          <View style={styles.headerStats}>
            <View style={styles.headerStat}>
              <Feather name="check-circle" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.headerStatText}>Received: {fmt(totalReceived)}</Text>
            </View>
            <View style={styles.headerStat}>
              <Feather name="clock" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.headerStatText}>Pending: {fmt(totalPending)}</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Revenue chart */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)}>
          <Card style={styles.chartCard}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Revenue Trend</Text>
            <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>Jan–May 2026</Text>
            <View style={styles.chartWrap}>
              <MiniChart data={MONTHLY_REVENUE} height={80} />
            </View>
            <View style={styles.chartLabels}>
              <View style={styles.chartLabelRow}>
                <View style={[styles.chartDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.chartLabelText, { color: colors.mutedForeground }]}>Monthly Revenue</Text>
              </View>
              <Text style={[styles.chartMax, { color: colors.text }]}>Peak: ₹16,000</Text>
            </View>
          </Card>
        </Animated.View>

        {/* Payout Card */}
        <Animated.View entering={FadeInDown.delay(140).duration(400)}>
          <Card style={styles.payoutCard} noPadding>
            <View style={[styles.payoutHeader, { backgroundColor: colors.primaryLight }]}>
              <View>
                <Text style={[styles.payoutTitle, { color: colors.text }]}>Next Payout</Text>
                <Text style={[styles.payoutDate, { color: colors.mutedForeground }]}>Scheduled {COUNSELOR.nextPayout.date}</Text>
              </View>
              <Text style={[styles.payoutAmount, { color: colors.primary }]}>{fmt(COUNSELOR.nextPayout.amount)}</Text>
            </View>
            <View style={styles.payoutBody}>
              {[
                { label: "Gross earnings", value: "₹16,500", color: colors.text },
                { label: "Platform fee (12%)", value: "–₹1,980", color: colors.destructive },
                { label: "TDS (2%)", value: "–₹330", color: colors.destructive },
              ].map((row) => (
                <View key={row.label} style={styles.payoutRow}>
                  <Text style={[styles.payoutLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                  <Text style={[styles.payoutValue, { color: row.color }]}>{row.value}</Text>
                </View>
              ))}
              <View style={[styles.payoutDivider, { backgroundColor: colors.border }]} />
              <View style={styles.payoutRow}>
                <Text style={[styles.payoutNetLabel, { color: colors.text }]}>Net payout</Text>
                <Text style={[styles.payoutNetValue, { color: colors.primary }]}>{fmt(COUNSELOR.nextPayout.amount)}</Text>
              </View>
              <View style={[styles.bankRow, { backgroundColor: colors.muted }]}>
                <Feather name="credit-card" size={14} color={colors.mutedForeground} />
                <Text style={[styles.bankText, { color: colors.textSecondary }]}>HDFC Bank ****4521</Text>
                <View style={[styles.verifiedBadge, { backgroundColor: colors.successLight }]}>
                  <Feather name="check" size={10} color={colors.success} />
                  <Text style={[styles.verifiedText, { color: colors.success }]}>Verified</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.payoutBtn, { backgroundColor: payoutRequested ? colors.muted : colors.primary }]}
                onPress={payoutRequested ? undefined : () => setShowPayoutSheet(true)}
                disabled={payoutRequested}
                activeOpacity={0.85}
              >
                <Feather name={payoutRequested ? "check" : "zap"} size={16} color={payoutRequested ? colors.mutedForeground : "#fff"} />
                <Text style={[styles.payoutBtnText, { color: payoutRequested ? colors.mutedForeground : "#fff" }]}>
                  {payoutRequested ? "Early Payout Requested" : "Request Early Payout"}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </Animated.View>

        {/* Payments — expandable */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.paymentsSection}>
          <View style={styles.paymentsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment History</Text>
            <Text style={[styles.sectionSub, { color: colors.mutedForeground }]}>Tap to expand · Pull to refresh</Text>
          </View>
          <View style={{ gap: 10 }}>
            {PAYMENTS.map((payment, idx) => (
              <Animated.View key={payment.id} entering={FadeInDown.delay(200 + idx * 40).duration(300)}>
                <PaymentCard
                  payment={payment}
                  expanded={expandedPayment === payment.id}
                  onToggle={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setExpandedPayment(expandedPayment === payment.id ? null : payment.id);
                  }}
                  onDownload={() => handleDownload(payment)}
                />
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Payout Request Bottom Sheet */}
      <BottomSheet
        visible={showPayoutSheet}
        onClose={() => setShowPayoutSheet(false)}
        title="Request Early Payout"
        snapHeight={420}
      >
        <View style={styles.sheetBody}>
          <View style={[styles.sheetSummary, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.sheetSummaryLabel, { color: colors.mutedForeground }]}>Available for early payout</Text>
            <Text style={[styles.sheetSummaryAmount, { color: colors.primary }]}>{fmt(COUNSELOR.nextPayout.amount)}</Text>
          </View>
          {[
            { label: "Bank Account", value: "HDFC Bank ****4521", icon: "credit-card" as const },
            { label: "Processing Time", value: "1–2 business days", icon: "clock" as const },
            { label: "Early Payout Fee", value: "₹50 (flat)", icon: "info" as const },
          ].map((row) => (
            <View key={row.label} style={[styles.sheetRow, { borderBottomColor: colors.border }]}>
              <Feather name={row.icon} size={14} color={colors.mutedForeground} />
              <Text style={[styles.sheetRowLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
              <Text style={[styles.sheetRowValue, { color: colors.text }]}>{row.value}</Text>
            </View>
          ))}
          <View style={[styles.sheetNote, { backgroundColor: colors.warningLight }]}>
            <Feather name="alert-triangle" size={14} color={colors.warning} />
            <Text style={[styles.sheetNoteText, { color: colors.warningForeground }]}>
              Early payouts are processed within 2 business days and incur a flat fee of ₹50.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.sheetBtn, { backgroundColor: colors.primary }]}
            onPress={handleRequestPayout}
            activeOpacity={0.85}
          >
            <Feather name="zap" size={16} color="#fff" />
            <Text style={styles.sheetBtnText}>Confirm Early Payout</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerLabel: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.75)", marginBottom: 4 },
  headerAmount: { fontSize: 36, fontFamily: "Inter_700Bold", color: "#fff", marginBottom: 12 },
  headerStats: { flexDirection: "row", gap: 20 },
  headerStat: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerStatText: { fontSize: 12, fontFamily: "Inter_500Medium", color: "rgba(255,255,255,0.85)" },
  scroll: { padding: 16, gap: 16 },
  chartCard: { gap: 4 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  sectionSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  chartWrap: { marginTop: 8, marginBottom: 4 },
  chartLabels: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  chartLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  chartDot: { width: 8, height: 8, borderRadius: 4 },
  chartLabelText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  chartMax: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  payoutCard: {},
  payoutHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderRadius: 16 },
  payoutTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  payoutDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  payoutAmount: { fontSize: 22, fontFamily: "Inter_700Bold" },
  payoutBody: { padding: 16, gap: 8 },
  payoutRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  payoutLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  payoutValue: { fontSize: 13, fontFamily: "Inter_500Medium" },
  payoutDivider: { height: 1, marginVertical: 4 },
  payoutNetLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  payoutNetValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  bankRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 10, borderRadius: 10, marginVertical: 4 },
  bankText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  verifiedText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  payoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 46, borderRadius: 12, marginTop: 4 },
  payoutBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  paymentsSection: { gap: 12 },
  paymentsHeader: { gap: 2 },
  paymentCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  paymentRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  paymentIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  paymentInfo: { flex: 1, gap: 2 },
  paymentName: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  paymentDesc: { fontSize: 11, fontFamily: "Inter_400Regular" },
  paymentDate: { fontSize: 11, fontFamily: "Inter_400Regular" },
  paymentRight: { alignItems: "flex-end", gap: 6 },
  paymentAmount: { fontSize: 14, fontFamily: "Inter_700Bold" },
  paymentDetail: { borderTopWidth: 1, padding: 14, gap: 0 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 9, borderBottomWidth: 1 },
  detailLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  detailValue: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  detailActions: { flexDirection: "row", gap: 10, paddingTop: 12 },
  downloadBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, height: 40, borderRadius: 10 },
  downloadBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  remindBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, height: 40, borderRadius: 10, borderWidth: 1.5 },
  remindBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sheetBody: { gap: 14 },
  sheetSummary: { borderRadius: 14, padding: 16, alignItems: "center", gap: 4 },
  sheetSummaryLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  sheetSummaryAmount: { fontSize: 28, fontFamily: "Inter_700Bold" },
  sheetRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, borderBottomWidth: 1 },
  sheetRowLabel: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  sheetRowValue: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sheetNote: { flexDirection: "row", gap: 10, padding: 12, borderRadius: 12, alignItems: "flex-start" },
  sheetNoteText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  sheetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 14 },
  sheetBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
