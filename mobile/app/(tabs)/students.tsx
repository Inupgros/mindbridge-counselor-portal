import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { MotiView } from "moti";
import React, { useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import type { Route, SceneRendererProps } from "react-native-tab-view";
import { TabView } from "react-native-tab-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/components/Toast";
import { useColors } from "@/hooks/useColors";
import { STUDENTS, type Student, type StudentStatus } from "@/constants/data";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const STATUS_VARIANT_MAP: Record<StudentStatus, "success" | "info" | "warning" | "error"> = {
  active:  "success",
  new:     "info",
  pending: "warning",
  denied:  "error",
};

const STATUS_LABEL_MAP: Record<StudentStatus, string> = {
  active:  "Active",
  new:     "New",
  pending: "Pending",
  denied:  "Denied",
};

type RouteKey = "all" | "new" | "active" | "pending" | "denied";

interface StudentRoute extends Route {
  key: RouteKey;
  title: string;
}

const ROUTES: StudentRoute[] = [
  { key: "all",     title: "All" },
  { key: "new",     title: "New" },
  { key: "active",  title: "Active" },
  { key: "pending", title: "Pending" },
  { key: "denied",  title: "Denied" },
];

const newCount = STUDENTS.filter((s) => s.status === "new").length;
const activeCount = STUDENTS.filter((s) => s.status === "active").length;

interface StudentListProps {
  tabKey: RouteKey;
  search: string;
  bulkMode: boolean;
  selected: Set<string>;
  onSelect: (id: string) => void;
  onLongPress: (id: string) => void;
  onQuickApprove: (student: Student) => void;
  onQuickDeny: (student: Student) => void;
}

function StudentList({
  tabKey,
  search,
  bulkMode,
  selected,
  onSelect,
  onLongPress,
  onQuickApprove,
  onQuickDeny,
}: StudentListProps) {
  const colors = useColors();

  const filtered = useMemo(() => {
    return STUDENTS.filter((s) => {
      if (tabKey !== "all" && s.status !== tabKey) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.school.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tabKey, search]);

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      scrollEnabled={!!filtered.length}
      renderItem={({ item, index }) => {
        const isSelected = selected.has(item.id);
        return (
          <Animated.View entering={FadeInDown.delay(index * 30).duration(250)}>
            <TouchableOpacity
              style={[
                styles.row,
                { borderBottomColor: colors.border, backgroundColor: isSelected ? colors.primaryLight : colors.card },
              ]}
              onPress={() => {
                if (bulkMode) {
                  onSelect(item.id);
                } else {
                  router.push({ pathname: "/student/[id]", params: { id: item.id } });
                }
              }}
              onLongPress={() => onLongPress(item.id)}
              activeOpacity={0.8}
              delayLongPress={400}
            >
              {bulkMode && (
                <View style={[
                  styles.checkbox,
                  { backgroundColor: isSelected ? colors.primary : "transparent", borderColor: isSelected ? colors.primary : colors.border },
                ]}>
                  {isSelected && <Feather name="check" size={12} color="#fff" />}
                </View>
              )}
              <Avatar initials={getInitials(item.name)} size={46} />
              <View style={styles.rowInfo}>
                <View style={styles.rowTop}>
                  <Text style={[styles.rowName, { color: colors.text }]}>{item.name}</Text>
                  <Badge label={STATUS_LABEL_MAP[item.status]} variant={STATUS_VARIANT_MAP[item.status]} />
                </View>
                <Text style={[styles.rowMeta, { color: colors.mutedForeground }]}>{item.school} · Grade {item.grade}</Text>
                {item.concerns.length > 0 && (
                  <Text style={[styles.rowConcerns, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {item.concerns.join(" · ")}
                  </Text>
                )}
                <View style={styles.rowBottom}>
                  <Text style={[styles.rowSessions, { color: colors.textSecondary }]}>
                    {item.sessionsCompleted} sessions
                  </Text>
                  {item.lastSession !== "-" && (
                    <Text style={[styles.rowLast, { color: colors.mutedForeground }]}>Last: {item.lastSession}</Text>
                  )}
                </View>
              </View>
              {!bulkMode && item.status === "new" && (
                <View style={styles.quickApprove}>
                  <TouchableOpacity
                    style={[styles.quickBtn, { backgroundColor: colors.successLight }]}
                    onPress={() => onQuickApprove(item)}
                    activeOpacity={0.8}
                  >
                    <Feather name="check" size={14} color={colors.success} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.quickBtn, { backgroundColor: colors.destructiveLight }]}
                    onPress={() => onQuickDeny(item)}
                    activeOpacity={0.8}
                  >
                    <Feather name="x" size={14} color={colors.destructive} />
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        );
      }}
      ListEmptyComponent={
        <EmptyState
          icon="users"
          title="No students found"
          message={search ? `No results for "${search}"` : "No students in this category."}
        />
      }
      contentContainerStyle={styles.listContent}
    />
  );
}

export default function StudentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const toast = useToast();
  const layout = useWindowDimensions();

  const [tabIndex, setTabIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);

  const currentTabKey = ROUTES[tabIndex].key;

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleLongPress = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBulkMode(true);
    setSelected(new Set([id]));
  };

  const exitBulkMode = () => {
    setBulkMode(false);
    setSelected(new Set());
  };

  const handleQuickApprove = (student: Student) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toast.show(`${student.name} approved!`, "success");
  };

  const handleQuickDeny = (student: Student) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toast.show(`${student.name} denied`, "warning");
  };

  const bulkApprove = () => {
    const count = selected.size;
    exitBulkMode();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    toast.show(`${count} student${count === 1 ? "" : "s"} approved!`, "success");
  };

  const bulkDeny = () => {
    const count = selected.size;
    exitBulkMode();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    toast.show(`${count} student${count === 1 ? "" : "s"} denied`, "warning");
  };

  const selectAll = () => {
    const filtered = STUDENTS.filter((s) => currentTabKey === "all" || s.status === currentTabKey);
    setSelected(new Set(filtered.map((s) => s.id)));
  };

  const tabCount = (key: RouteKey) =>
    key === "all" ? STUDENTS.length : STUDENTS.filter((s) => s.status === key).length;

  const renderScene = ({ route }: SceneRendererProps & { route: StudentRoute }) => (
    <StudentList
      tabKey={route.key}
      search={search}
      bulkMode={bulkMode}
      selected={selected}
      onSelect={toggleSelect}
      onLongPress={handleLongPress}
      onQuickApprove={handleQuickApprove}
      onQuickDeny={handleQuickDeny}
    />
  );

  // Custom tab bar — avoids react-native-tab-view's TabBar (ESM compat issue on web)
  const renderTabBar = (_props: SceneRendererProps) => (
    <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBarContent}>
        {ROUTES.map((route, i) => {
          const isActive = i === tabIndex;
          const count = tabCount(route.key);
          return (
            <TouchableOpacity
              key={route.key}
              style={[styles.tabItem, isActive && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
              onPress={() => { setTabIndex(i); exitBulkMode(); }}
              activeOpacity={0.75}
            >
              <View style={styles.tabLabelRow}>
                <Text style={[styles.tabLabelText, { color: isActive ? colors.primary : colors.mutedForeground }]}>
                  {route.title}
                </Text>
                {count > 0 && (
                  <View style={[styles.tabBadge, { backgroundColor: isActive ? colors.primary : colors.muted }]}>
                    <Text style={[styles.tabBadgeText, { color: isActive ? "#fff" : colors.mutedForeground }]}>
                      {count}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
        style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Students</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>{STUDENTS.length} total · {activeCount} active</Text>

        {/* Smart insights banner */}
        {newCount > 0 && !bulkMode && (
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 200 }}
            style={[styles.insightBanner, { backgroundColor: colors.primaryLight, borderColor: colors.primary + "30" }]}
          >
            <Feather name="bell" size={14} color={colors.primary} />
            <Text style={[styles.insightText, { color: colors.primary }]}>
              {newCount} new referral{newCount === 1 ? "" : "s"} awaiting review · Long-press to bulk select
            </Text>
          </MotiView>
        )}

        {/* Search */}
        <View style={[styles.searchBox, { backgroundColor: colors.background, borderColor: searchFocused ? colors.primary : colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, fontFamily: "Inter_400Regular" }]}
            placeholder="Search by name or school..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </MotiView>

      {/* Bulk mode action bar */}
      {bulkMode && (
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 18 }}
          style={[styles.bulkBar, { backgroundColor: colors.primary }]}
        >
          <TouchableOpacity onPress={exitBulkMode} style={styles.bulkClose}>
            <Feather name="x" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.bulkCount}>{selected.size} selected</Text>
          <TouchableOpacity onPress={selectAll} style={styles.bulkAction}>
            <Text style={styles.bulkActionText}>All</Text>
          </TouchableOpacity>
          <View style={styles.bulkDivider} />
          <TouchableOpacity onPress={bulkApprove} style={[styles.bulkActionBtn, { backgroundColor: "#fff" }]}>
            <Feather name="check" size={14} color={colors.primary} />
            <Text style={[styles.bulkActionBtnText, { color: colors.primary }]}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={bulkDeny} style={[styles.bulkActionBtn, { backgroundColor: colors.destructive }]}>
            <Feather name="x" size={14} color="#fff" />
            <Text style={[styles.bulkActionBtnText, { color: "#fff" }]}>Deny</Text>
          </TouchableOpacity>
        </MotiView>
      )}

      {/* Tab view */}
      <TabView<StudentRoute>
        navigationState={{ index: tabIndex, routes: ROUTES }}
        renderScene={renderScene}
        onIndexChange={(i) => { setTabIndex(i); exitBulkMode(); }}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
        lazy
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, gap: 4 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  sub: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 4 },
  insightBanner: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginBottom: 6 },
  insightText: { flex: 1, fontSize: 12, fontFamily: "Inter_500Medium", lineHeight: 18 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 12, height: 44, marginTop: 4 },
  searchInput: { flex: 1, fontSize: 14 },
  tabBar: { borderBottomWidth: 1 },
  tabBarContent: { flexDirection: "row" },
  tabItem: { paddingHorizontal: 16, paddingVertical: 12, alignItems: "center", justifyContent: "center" },
  tabLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  tabLabelText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  tabBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  tabBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  bulkBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  bulkClose: { padding: 4 },
  bulkCount: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#fff", flex: 1 },
  bulkAction: { padding: 6 },
  bulkActionText: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "rgba(255,255,255,0.8)" },
  bulkDivider: { width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.3)" },
  bulkActionBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  bulkActionBtnText: { fontSize: 12, fontFamily: "Inter_700Bold" },
  listContent: { flexGrow: 1 },
  row: { flexDirection: "row", padding: 16, gap: 14, borderBottomWidth: 1, alignItems: "center" },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  rowInfo: { flex: 1, gap: 3 },
  rowTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rowName: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  rowMeta: { fontSize: 12, fontFamily: "Inter_400Regular" },
  rowConcerns: { fontSize: 11, fontFamily: "Inter_400Regular", fontStyle: "italic" },
  rowBottom: { flexDirection: "row", justifyContent: "space-between", marginTop: 2 },
  rowSessions: { fontSize: 11, fontFamily: "Inter_500Medium" },
  rowLast: { fontSize: 11, fontFamily: "Inter_400Regular" },
  quickApprove: { flexDirection: "row", gap: 6 },
  quickBtn: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});
