import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { MotiView } from "moti";
import React, { useCallback, useRef, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/EmptyState";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/Toast";
import { useColors } from "@/hooks/useColors";
import { APPOINTMENTS, STUDENTS, type AppointmentStatus } from "@/constants/data";

type Filter = "all" | "upcoming" | "completed" | "cancelled";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_VARIANT_MAP: Record<AppointmentStatus, "success" | "info" | "error" | "warning"> = {
  completed:   "success",
  upcoming:    "info",
  cancelled:   "error",
  in_progress: "warning",
};

function statusVariant(status: AppointmentStatus): "success" | "info" | "error" | "warning" {
  return STATUS_VARIANT_MAP[status];
}

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function isSameDay(date: Date, year: number, month: number, day: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
}

const SESSION_TYPES = ["Career Counseling", "Mental Health", "Academic Coaching", "Follow-up", "Parent Meeting"];
const MODES = ["Online", "Offline"] as const;

interface AppointmentItem {
  id: string;
  studentName: string;
  studentId: string;
  school: string;
  date: string;
  time: string;
  duration: number;
  mode: "Online" | "Offline";
  type: string;
  status: AppointmentStatus;
  notes: string;
}

// ─── Swipeable row ────────────────────────────────────────────────────────────
function SwipeableApptRow({
  item,
  index,
  onCancel,
}: {
  item: AppointmentItem;
  index: number;
  onCancel: (id: string) => void;
}) {
  const colors = useColors();
  const swipeRef = useRef<Swipeable>(null);

  const renderRightActions = () => (
    <TouchableOpacity
      style={[styles.swipeAction, { backgroundColor: colors.destructive }]}
      onPress={() => { swipeRef.current?.close(); onCancel(item.id); }}
      activeOpacity={0.85}
    >
      <Feather name="x-circle" size={20} color="#fff" />
      <Text style={styles.swipeActionText}>Cancel</Text>
    </TouchableOpacity>
  );

  return (
    <MotiView
      from={{ opacity: 0, translateX: -10 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: "timing", delay: index * 40, duration: 300 }}
    >
      <Swipeable
        ref={swipeRef}
        renderRightActions={item.status === "upcoming" ? renderRightActions : undefined}
        overshootRight={false}
        rightThreshold={80}
        onSwipeableOpen={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
      >
        <View style={[styles.apptRow, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
          <View style={[styles.apptDate, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.apptDay, { color: colors.primary }]}>{new Date(item.date).getDate()}</Text>
            <Text style={[styles.apptMonth, { color: colors.primary }]}>
              {MONTHS[new Date(item.date).getMonth()].slice(0, 3)}
            </Text>
          </View>
          <Avatar initials={getInitials(item.studentName)} size={40} />
          <View style={styles.apptInfo}>
            <Text style={[styles.apptStudent, { color: colors.text }]}>{item.studentName}</Text>
            <Text style={[styles.apptMeta, { color: colors.mutedForeground }]}>
              {item.time} · {item.type} · {item.mode}
            </Text>
            <Text style={[styles.apptSchool, { color: colors.mutedForeground }]}>{item.school}</Text>
          </View>
          <View style={styles.apptRight}>
            <Badge
              label={item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              variant={statusVariant(item.status)}
            />
            {item.status === "upcoming" && (
              <Text style={[styles.swipeHintLabel, { color: colors.mutedForeground }]}>← swipe</Text>
            )}
          </View>
        </View>
      </Swipeable>
    </MotiView>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function AppointmentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomInset = Platform.OS === "web" ? 34 : insets.bottom;
  const toast = useToast();

  const today = new Date(2026, 4, 3);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(4);
  const [filter, setFilter] = useState<Filter>("all");
  const [appts, setAppts] = useState<AppointmentItem[]>(APPOINTMENTS);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  // Booking state
  const [bookStudentId, setBookStudentId] = useState("");
  const [bookStudentSearch, setBookStudentSearch] = useState("");
  const [bookDate, setBookDate] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [bookType, setBookType] = useState(SESSION_TYPES[0]);
  const [bookMode, setBookMode] = useState<"Online" | "Offline">("Online");
  const [bookNotes, setBookNotes] = useState("");

  // @gorhom/bottom-sheet refs
  const bookSheetRef = useRef<BottomSheetModal>(null);
  const cancelSheetRef = useRef<BottomSheetModal>(null);

  const bookSnapPoints = useMemo(() => ["85%"], []);
  const cancelSnapPoints = useMemo(() => ["40%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const filteredStudents = useMemo(() => {
    if (!bookStudentSearch) return STUDENTS.slice(0, 5);
    return STUDENTS.filter((s) =>
      s.name.toLowerCase().includes(bookStudentSearch.toLowerCase())
    ).slice(0, 5);
  }, [bookStudentSearch]);

  // Calendar math
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const calendarDays: (number | null)[] = Array.from(
    { length: firstDay + daysInMonth },
    (_, i) => (i < firstDay ? null : i - firstDay + 1)
  );

  const daysWithAppts = useMemo(() => {
    const set = new Set<number>();
    appts.forEach((a) => {
      const d = new Date(a.date);
      if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) set.add(d.getDate());
    });
    return set;
  }, [appts, viewYear, viewMonth]);

  const displayedAppts = useMemo(() =>
    appts.filter((a) => {
      const d = new Date(a.date);
      if (selectedDate !== null &&
          !isSameDay(d, selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()))
        return false;
      if (filter !== "all" && a.status !== filter) return false;
      return true;
    }),
    [appts, selectedDate, filter]
  );

  const handleDayPress = (day: number) => {
    const pressed = new Date(viewYear, viewMonth, day);
    const alreadySelected =
      selectedDate !== null &&
      isSameDay(pressed, selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    setSelectedDate(alreadySelected ? null : pressed);
    Haptics.selectionAsync();
  };

  const prevMonth = () => {
    setSelectedDate(null);
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    setSelectedDate(null);
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const handleBook = () => {
    bookSheetRef.current?.dismiss();
    setBookStudentSearch(""); setBookDate(""); setBookTime(""); setBookNotes("");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toast.show("Session booked successfully!", "success");
  };

  const handleCancel = (id: string) => {
    setCancelTarget(id);
    cancelSheetRef.current?.present();
  };

  const handleCancelConfirm = () => {
    if (!cancelTarget) return;
    setAppts((prev) =>
      prev.map((a) => (a.id === cancelTarget ? { ...a, status: "cancelled" as const } : a))
    );
    cancelSheetRef.current?.dismiss();
    setCancelTarget(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    toast.show("Session cancelled", "warning");
  };

  const targetAppt = appts.find((a) => a.id === cancelTarget);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ── Header + inline calendar ─────────────────────────────────────── */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Schedule</Text>
            <Text style={[styles.sub, { color: colors.mutedForeground }]}>
              {appts.filter((a) => a.status === "upcoming").length} upcoming sessions
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.bookBtn, { backgroundColor: colors.primary }]}
            onPress={() => bookSheetRef.current?.present()}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.bookBtnText}>Book</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Feather name="chevron-left" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.monthLabel, { color: colors.text }]}>{MONTHS[viewMonth]} {viewYear}</Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Feather name="chevron-right" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.dayHeaders}>
          {DAYS.map((d) => (
            <Text key={d} style={[styles.dayHeader, { color: colors.mutedForeground }]}>{d}</Text>
          ))}
        </View>

        <View style={styles.calGrid}>
          {calendarDays.map((day, i) => {
            if (day === null) return <View key={`e-${i}`} style={styles.dayCell} />;
            const isSelected =
              selectedDate !== null &&
              isSameDay(new Date(viewYear, viewMonth, day),
                selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const isToday = isSameDay(today, viewYear, viewMonth, day);
            const hasAppt = daysWithAppts.has(day);
            return (
              <TouchableOpacity
                key={`d-${day}`}
                style={[
                  styles.dayCell,
                  isSelected && { backgroundColor: colors.primary, borderRadius: 8 },
                  !isSelected && isToday && [styles.dayCellToday, { borderColor: colors.primary }],
                ]}
                onPress={() => handleDayPress(day)}
                activeOpacity={0.7}
              >
                <Text style={[styles.dayNum, {
                  color: isSelected ? "#fff" : isToday ? colors.primary : colors.text,
                }]}>
                  {day}
                </Text>
                {hasAppt && !isSelected && (
                  <View style={[styles.apptDot, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedDate !== null && (
          <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.clearDateRow}>
            <Feather name="x" size={12} color={colors.primary} />
            <Text style={[styles.clearDateText, { color: colors.primary }]}>
              Showing {MONTHS[selectedDate.getMonth()].slice(0, 3)} {selectedDate.getDate()} · Tap to clear
            </Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* ── Filter chips ──────────────────────────────────────────────────── */}
      <View style={[styles.filters, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.chip,
                {
                  borderColor: filter === f.key ? colors.primary : colors.border,
                  backgroundColor: filter === f.key ? colors.primaryLight : colors.background,
                },
              ]}
              onPress={() => setFilter(f.key)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, { color: filter === f.key ? colors.primary : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {displayedAppts.length > 0 && (
        <View style={[styles.swipeHintBar, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={11} color={colors.mutedForeground} />
          <Text style={[styles.swipeHintBarText, { color: colors.mutedForeground }]}>
            Swipe left on upcoming sessions to cancel
          </Text>
        </View>
      )}

      {/* ── Appointment list ──────────────────────────────────────────────── */}
      <FlatList
        data={displayedAppts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <SwipeableApptRow item={item} index={index} onCancel={handleCancel} />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar"
            title={selectedDate !== null ? "No appointments on this day" : "No appointments"}
            message={filter !== "all" ? `No ${filter} sessions found.` : "Your schedule is clear."}
          />
        }
        contentContainerStyle={styles.listContent}
      />

      {/* ── Booking sheet — @gorhom/bottom-sheet ─────────────────────────── */}
      <BottomSheetModal
        ref={bookSheetRef}
        snapPoints={bookSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <View style={[styles.sheetTitle, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sheetTitleText, { color: colors.text }]}>Book Session</Text>
          <TouchableOpacity onPress={() => bookSheetRef.current?.dismiss()}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
        <BottomSheetScrollView contentContainerStyle={styles.sheetBody} keyboardShouldPersistTaps="handled">
          <Text style={[styles.sheetLabel, { color: colors.text }]}>Student</Text>
          <View style={[styles.studentSearch, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Feather name="search" size={14} color={colors.mutedForeground} />
            <Input
              placeholder="Search student..."
              value={bookStudentSearch}
              onChangeText={setBookStudentSearch}
              containerStyle={styles.inlineInput}
            />
          </View>
          <View style={styles.studentPickerList}>
            {filteredStudents.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.studentPickerRow,
                  {
                    backgroundColor: bookStudentId === s.id ? colors.primaryLight : colors.background,
                    borderColor: bookStudentId === s.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => { setBookStudentId(s.id); setBookStudentSearch(s.name); }}
                activeOpacity={0.8}
              >
                <View style={[styles.studentPickerInitials, { backgroundColor: colors.primaryLight }]}>
                  <Text style={[styles.initialsText, { color: colors.primary }]}>
                    {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.studentPickerInfo}>
                  <Text style={[styles.studentPickerName, { color: colors.text }]}>{s.name}</Text>
                  <Text style={[styles.studentPickerMeta, { color: colors.mutedForeground }]}>
                    {s.school} · Grade {s.grade}
                  </Text>
                </View>
                {bookStudentId === s.id && <Feather name="check" size={16} color={colors.primary} />}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.sheetLabel, { color: colors.text }]}>Session Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
            {SESSION_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeChip,
                  {
                    borderColor: bookType === t ? colors.primary : colors.border,
                    backgroundColor: bookType === t ? colors.primaryLight : colors.background,
                  },
                ]}
                onPress={() => setBookType(t)}
                activeOpacity={0.8}
              >
                <Text style={[styles.typeChipText, { color: bookType === t ? colors.primary : colors.mutedForeground }]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.modeRow}>
            {MODES.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.modeBtn,
                  {
                    borderColor: bookMode === m ? colors.primary : colors.border,
                    backgroundColor: bookMode === m ? colors.primaryLight : colors.background,
                  },
                ]}
                onPress={() => setBookMode(m)}
                activeOpacity={0.8}
              >
                <Feather
                  name={m === "Online" ? "video" : "map-pin"}
                  size={14}
                  color={bookMode === m ? colors.primary : colors.mutedForeground}
                />
                <Text style={[styles.modeBtnText, { color: bookMode === m ? colors.primary : colors.mutedForeground }]}>
                  {m}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input
            label="Date"
            placeholder="e.g. 2026-05-20"
            value={bookDate}
            onChangeText={setBookDate}
            leftIcon={<Feather name="calendar" size={16} color={colors.mutedForeground} />}
            containerStyle={styles.sheetField}
          />
          <Input
            label="Time"
            placeholder="e.g. 10:00 AM"
            value={bookTime}
            onChangeText={setBookTime}
            leftIcon={<Feather name="clock" size={16} color={colors.mutedForeground} />}
            containerStyle={styles.sheetField}
          />
          <Input
            label="Notes (optional)"
            placeholder="Pre-session notes..."
            value={bookNotes}
            onChangeText={setBookNotes}
            leftIcon={<Feather name="file-text" size={16} color={colors.mutedForeground} />}
            containerStyle={styles.sheetField}
          />

          <TouchableOpacity
            style={[styles.sheetBtn, { backgroundColor: colors.primary }]}
            onPress={handleBook}
            activeOpacity={0.85}
          >
            <Feather name="check" size={16} color="#fff" />
            <Text style={styles.sheetBtnText}>Confirm Booking</Text>
          </TouchableOpacity>
          <View style={{ height: bottomInset + 16 }} />
        </BottomSheetScrollView>
      </BottomSheetModal>

      {/* ── Cancel confirm sheet ─────────────────────────────────────────── */}
      <BottomSheetModal
        ref={cancelSheetRef}
        snapPoints={cancelSnapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <View style={[styles.sheetTitle, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sheetTitleText, { color: colors.text }]}>Cancel Session?</Text>
          <TouchableOpacity onPress={() => cancelSheetRef.current?.dismiss()}>
            <Feather name="x" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>
        <BottomSheetView style={styles.cancelSheetBody}>
          {targetAppt != null && (
            <View style={[styles.cancelCard, { backgroundColor: colors.destructiveLight, borderColor: colors.destructive + "40" }]}>
              <Feather name="alert-triangle" size={20} color={colors.destructive} />
              <View style={styles.cancelInfo}>
                <Text style={[styles.cancelStudent, { color: colors.text }]}>{targetAppt.studentName}</Text>
                <Text style={[styles.cancelMeta, { color: colors.mutedForeground }]}>
                  {targetAppt.date} · {targetAppt.time} · {targetAppt.type}
                </Text>
              </View>
            </View>
          )}
          <Text style={[styles.cancelNote, { color: colors.mutedForeground }]}>
            This will cancel the session and notify the student. This action cannot be undone.
          </Text>
          <View style={styles.cancelActions}>
            <TouchableOpacity
              style={[styles.cancelActionBtn, { backgroundColor: colors.muted }]}
              onPress={() => cancelSheetRef.current?.dismiss()}
              activeOpacity={0.8}
            >
              <Text style={[styles.cancelActionText, { color: colors.text }]}>Keep Session</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelActionBtn, { backgroundColor: colors.destructive }]}
              onPress={handleCancelConfirm}
              activeOpacity={0.85}
            >
              <Text style={[styles.cancelActionText, { color: "#fff" }]}>Yes, Cancel</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8, borderBottomWidth: 1 },
  headerTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 4 },
  sub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  bookBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, marginTop: 4 },
  bookBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#fff" },
  monthNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  navBtn: { padding: 4 },
  monthLabel: { fontSize: 15, fontFamily: "Inter_700Bold" },
  dayHeaders: { flexDirection: "row" },
  dayHeader: { flex: 1, textAlign: "center", fontSize: 11, fontFamily: "Inter_500Medium", paddingBottom: 8 },
  calGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: { width: "14.285714%" as `${number}%`, aspectRatio: 1, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "transparent" },
  dayCellToday: { borderWidth: 1.5, borderRadius: 8 },
  dayNum: { fontSize: 13, fontFamily: "Inter_500Medium" },
  apptDot: { width: 4, height: 4, borderRadius: 2, position: "absolute", bottom: 4 },
  clearDateRow: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center", paddingVertical: 8 },
  clearDateText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  filters: { borderBottomWidth: 1 },
  filtersContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  swipeHintBar: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 6 },
  swipeHintBarText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  listContent: { flexGrow: 1 },
  apptRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12, borderBottomWidth: 1 },
  apptDate: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  apptDay: { fontSize: 16, fontFamily: "Inter_700Bold" },
  apptMonth: { fontSize: 9, fontFamily: "Inter_500Medium" },
  apptInfo: { flex: 1 },
  apptStudent: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  apptMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  apptSchool: { fontSize: 11, fontFamily: "Inter_400Regular" },
  apptRight: { alignItems: "flex-end", gap: 4 },
  swipeHintLabel: { fontSize: 9, fontFamily: "Inter_400Regular" },
  swipeAction: { width: 80, alignItems: "center", justifyContent: "center", gap: 4 },
  swipeActionText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: "#fff" },
  sheetTitle: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  sheetTitleText: { fontSize: 17, fontFamily: "Inter_700Bold" },
  sheetBody: { paddingHorizontal: 20, paddingTop: 16, gap: 14 },
  sheetLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  studentSearch: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderRadius: 12, paddingLeft: 10, marginBottom: 8 },
  inlineInput: { flex: 1 },
  studentPickerList: { gap: 6, marginBottom: 4 },
  studentPickerRow: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderRadius: 12, padding: 10 },
  studentPickerInitials: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  initialsText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  studentPickerInfo: { flex: 1 },
  studentPickerName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  studentPickerMeta: { fontSize: 11, fontFamily: "Inter_400Regular" },
  typeRow: { gap: 8, paddingBottom: 4 },
  typeChip: { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  typeChipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  modeRow: { flexDirection: "row", gap: 10, marginBottom: 4 },
  modeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5 },
  modeBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  sheetField: { marginBottom: 4 },
  sheetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: 14, marginTop: 4 },
  sheetBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
  cancelSheetBody: { paddingHorizontal: 20, paddingTop: 16, gap: 14 },
  cancelCard: { flexDirection: "row", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "center" },
  cancelInfo: { flex: 1, gap: 4 },
  cancelStudent: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  cancelMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cancelNote: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, textAlign: "center" },
  cancelActions: { flexDirection: "row", gap: 10 },
  cancelActionBtn: { flex: 1, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cancelActionText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
