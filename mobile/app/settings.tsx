import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BottomSheet } from "@/components/BottomSheet";
import { useToast } from "@/components/Toast";
import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/context/AuthContext";
import { COUNSELOR } from "@/constants/data";

const LANGUAGES = ["English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati"];
const SESSION_DURATIONS = ["30 min", "45 min", "60 min", "90 min"];
const QUIET_HOURS = ["9:00 PM", "10:00 PM", "11:00 PM", "Disabled"];

const FAQ_ITEMS = [
  { q: "How is my payout calculated?", a: "Payout = Gross earnings − 12% platform fee − 2% TDS. Scheduled on the 5th of each month." },
  { q: "What is early payout?", a: "Early payout lets you request your earnings before the scheduled date. A flat ₹50 fee applies and it processes in 1–2 business days." },
  { q: "How do I get verified?", a: "Upload your RCI Registration, Degree Certificate, and a Government Photo ID. Verification takes 1–3 business days." },
  { q: "Can I manage multiple schools?", a: "Yes. Schools can invite you to manage their students. You'll receive invitations in the Schools → Invites tab." },
  { q: "How do I cancel a session?", a: "Go to Schedule, swipe left on any upcoming session, and tap Cancel. The student will be notified automatically." },
];

function SettingRow({ icon, label, sub, value, danger, onPress }: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  sub?: string;
  value?: string;
  danger?: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <TouchableOpacity style={[styles.settingRow, { borderBottomColor: colors.border }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.settingIcon, { backgroundColor: danger ? colors.destructiveLight : colors.primaryLight }]}>
        <Feather name={icon} size={16} color={danger ? colors.destructive : colors.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: danger ? colors.destructive : colors.text }]}>{label}</Text>
        {sub && <Text style={[styles.settingSub, { color: colors.mutedForeground }]}>{sub}</Text>}
      </View>
      {value && <Text style={[styles.settingValue, { color: colors.mutedForeground }]}>{value}</Text>}
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </TouchableOpacity>
  );
}

function ToggleRow({ icon, label, sub, value, onToggle }: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  sub?: string;
  value: boolean;
  onToggle: () => void;
}) {
  const colors = useColors();
  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.settingIcon, { backgroundColor: colors.primaryLight }]}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
        {sub && <Text style={[styles.settingSub, { color: colors.mutedForeground }]}>{sub}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onToggle(); }}
        trackColor={{ false: "#E5E7EB", true: "#155DFC" }}
        thumbColor="#fff"
      />
    </View>
  );
}

function FaqAccordion() {
  const colors = useColors();
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Card noPadding>
      {FAQ_ITEMS.map((item, i) => (
        <View key={i}>
          <TouchableOpacity
            style={[styles.faqRow, { borderBottomColor: i < FAQ_ITEMS.length - 1 ? colors.border : "transparent" }]}
            onPress={() => { setOpen(open === i ? null : i); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.faqQ, { color: colors.text }]}>{item.q}</Text>
            <Feather name={open === i ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          {open === i && (
            <View style={[styles.faqAnswer, { backgroundColor: colors.muted }]}>
              <Text style={[styles.faqA, { color: colors.textSecondary }]}>{item.a}</Text>
            </View>
          )}
        </View>
      ))}
    </Card>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const { logout } = useAuth();
  const toast = useToast();

  // Toggles
  const [notifStudents, setNotifStudents] = useState(true);
  const [notifAppointments, setNotifAppointments] = useState(true);
  const [notifPayments, setNotifPayments] = useState(true);
  const [notifSchools, setNotifSchools] = useState(true);
  const [twoFa, setTwoFa] = useState(false);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [autoNotes, setAutoNotes] = useState(false);
  const [onlineDefault, setOnlineDefault] = useState(true);

  // Sheets
  const [showLangSheet, setShowLangSheet] = useState(false);
  const [showDurationSheet, setShowDurationSheet] = useState(false);
  const [showQuietHoursSheet, setShowQuietHoursSheet] = useState(false);
  const [showLogoutSheet, setShowLogoutSheet] = useState(false);

  // Prefs
  const [selectedLang, setSelectedLang] = useState("English");
  const [sessionDuration, setSessionDuration] = useState("45 min");
  const [quietHour, setQuietHour] = useState("10:00 PM");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handlePickPhoto = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Allow photo library access to change your profile photo.");
        return;
      }
    }
    if (Platform.OS === "web") {
      toast.show("Photo updated!", "success");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      toast.show("Profile photo updated!", "success");
    }
  };

  const handleLogout = async () => {
    setShowLogoutSheet(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await logout();
    router.replace("/(auth)/login");
  };

  const handleLogoutAll = () => {
    setShowLogoutSheet(false);
    toast.show("Signed out of all devices", "info");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 24 }]}>
        {/* Profile Card */}
        <Card noPadding style={styles.profileCard}>
          <View style={[styles.cover, { backgroundColor: colors.primary }]} />
          <View style={[styles.profileBody, { backgroundColor: colors.card }]}>
            <View style={styles.profileAvatarRow}>
              <TouchableOpacity style={[styles.profileAvatarWrap, { borderColor: colors.card }]} onPress={handlePickPhoto} activeOpacity={0.85}>
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.profilePhoto} contentFit="cover" />
                ) : (
                  <Avatar initials="AS" size={72} color={colors.primary} />
                )}
                <View style={[styles.cameraBtn, { backgroundColor: colors.primary }]}>
                  <Feather name="camera" size={12} color="#fff" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.editBtn, { backgroundColor: colors.primaryLight }]} activeOpacity={0.8}>
                <Feather name="edit-3" size={14} color={colors.primary} />
                <Text style={[styles.editBtnText, { color: colors.primary }]}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.profileName, { color: colors.text }]}>{COUNSELOR.name}</Text>
            <Text style={[styles.profileRole, { color: colors.mutedForeground }]}>{COUNSELOR.role}</Text>
            <View style={styles.profileBadges}>
              <Badge label="Verified" variant="success" />
              <Badge label={`${COUNSELOR.experience} yrs exp`} variant="info" />
              <Badge label={`${COUNSELOR.specializations.length} specs`} variant="default" />
            </View>
            <View style={[styles.completenessRow, { borderTopColor: colors.border }]}>
              <Text style={[styles.completenessLabel, { color: colors.mutedForeground }]}>Profile Completeness</Text>
              <Text style={[styles.completenessValue, { color: colors.primary }]}>92%</Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.primary, width: "92%" }]} />
            </View>
          </View>
        </Card>

        {/* Account */}
        <Animated.View entering={FadeInDown.delay(60).duration(300)} style={styles.group}>
          <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Account</Text>
          <Card noPadding>
            <SettingRow icon="user" label="Personal Info" sub={COUNSELOR.email} onPress={() => {}} />
            <SettingRow icon="briefcase" label="Specialization" sub={COUNSELOR.specializations.slice(0, 2).join(", ")} onPress={() => {}} />
            <SettingRow icon="credit-card" label="Bank & Payout" sub="HDFC Bank ****4521 · Verified" onPress={() => {}} />
            <SettingRow icon="file-text" label="Documents" sub="6 uploaded · 5 verified" onPress={() => {}} />
          </Card>
        </Animated.View>

        {/* Session Preferences */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.group}>
          <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Session Preferences</Text>
          <Card noPadding>
            <SettingRow icon="clock" label="Default Duration" value={sessionDuration} onPress={() => setShowDurationSheet(true)} />
            <ToggleRow icon="video" label="Online by Default" sub="New sessions default to online mode" value={onlineDefault} onToggle={() => setOnlineDefault((v) => !v)} />
            <ToggleRow icon="file-text" label="Auto-generate Notes" sub="AI summarizes session highlights" value={autoNotes} onToggle={() => setAutoNotes((v) => !v)} />
            <ToggleRow icon="bell" label="Session Reminders" sub="30 min before each session" value={sessionReminders} onToggle={() => setSessionReminders((v) => !v)} />
          </Card>
        </Animated.View>

        {/* Security */}
        <Animated.View entering={FadeInDown.delay(140).duration(300)} style={styles.group}>
          <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Security</Text>
          <Card noPadding>
            <SettingRow icon="lock" label="Change Password" onPress={() => {}} />
            <ToggleRow icon="shield" label="Two-Factor Authentication" sub="Extra security via SMS OTP" value={twoFa} onToggle={() => setTwoFa((v) => !v)} />
            <SettingRow icon="monitor" label="Active Sessions" sub="3 devices currently active" onPress={() => {}} />
          </Card>
        </Animated.View>

        {/* Notifications */}
        <Animated.View entering={FadeInDown.delay(180).duration(300)} style={styles.group}>
          <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Notifications</Text>
          <Card noPadding>
            <ToggleRow icon="users" label="New Student Requests" value={notifStudents} onToggle={() => setNotifStudents((v) => !v)} />
            <ToggleRow icon="calendar" label="Appointment Reminders" value={notifAppointments} onToggle={() => setNotifAppointments((v) => !v)} />
            <ToggleRow icon="dollar-sign" label="Payment Updates" value={notifPayments} onToggle={() => setNotifPayments((v) => !v)} />
            <ToggleRow icon="book-open" label="School Invites" value={notifSchools} onToggle={() => setNotifSchools((v) => !v)} />
            <SettingRow icon="moon" label="Quiet Hours" sub="No notifications after..." value={quietHour} onPress={() => setShowQuietHoursSheet(true)} />
          </Card>
        </Animated.View>

        {/* Preferences */}
        <Animated.View entering={FadeInDown.delay(220).duration(300)} style={styles.group}>
          <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Preferences</Text>
          <Card noPadding>
            <SettingRow icon="globe" label="Language" value={selectedLang} onPress={() => setShowLangSheet(true)} />
            <SettingRow icon="moon" label="Appearance" value="System" onPress={() => {}} />
          </Card>
        </Animated.View>

        {/* Help & FAQ */}
        <Animated.View entering={FadeInDown.delay(260).duration(300)} style={styles.group}>
          <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Help & FAQ</Text>
          <FaqAccordion />
          <Card noPadding style={{ marginTop: 10 }}>
            <SettingRow icon="message-circle" label="Contact Support" sub="chat or email" onPress={() => {}} />
            <SettingRow icon="info" label="About MindBridge" value="v1.0.0" onPress={() => {}} />
          </Card>
        </Animated.View>

        {/* Sign Out */}
        <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.group}>
          <Card noPadding>
            <SettingRow icon="log-out" label="Sign Out" sub="Sign out of this device" danger onPress={() => setShowLogoutSheet(true)} />
          </Card>
        </Animated.View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>MindBridge Counselor Portal v1.0.0</Text>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>RCI Reg: {COUNSELOR.regNumber}</Text>
        </View>
      </ScrollView>

      {/* Language Sheet */}
      <BottomSheet visible={showLangSheet} onClose={() => setShowLangSheet(false)} title="Select Language" snapHeight={420}>
        <View style={styles.sheetList}>
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang}
              style={[styles.sheetOption, { borderColor: selectedLang === lang ? colors.primary : colors.border, backgroundColor: selectedLang === lang ? colors.primaryLight : colors.background }]}
              onPress={() => { setSelectedLang(lang); setShowLangSheet(false); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toast.show(`Language set to ${lang}`, "info"); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.sheetOptionText, { color: selectedLang === lang ? colors.primary : colors.text }]}>{lang}</Text>
              {selectedLang === lang && <Feather name="check" size={16} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* Session Duration Sheet */}
      <BottomSheet visible={showDurationSheet} onClose={() => setShowDurationSheet(false)} title="Default Session Duration" snapHeight={340}>
        <View style={styles.sheetList}>
          {SESSION_DURATIONS.map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.sheetOption, { borderColor: sessionDuration === d ? colors.primary : colors.border, backgroundColor: sessionDuration === d ? colors.primaryLight : colors.background }]}
              onPress={() => { setSessionDuration(d); setShowDurationSheet(false); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toast.show(`Default duration set to ${d}`, "info"); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.sheetOptionText, { color: sessionDuration === d ? colors.primary : colors.text }]}>{d}</Text>
              {sessionDuration === d && <Feather name="check" size={16} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* Quiet Hours Sheet */}
      <BottomSheet visible={showQuietHoursSheet} onClose={() => setShowQuietHoursSheet(false)} title="Quiet Hours Start" snapHeight={360}>
        <View style={styles.sheetList}>
          {QUIET_HOURS.map((h) => (
            <TouchableOpacity
              key={h}
              style={[styles.sheetOption, { borderColor: quietHour === h ? colors.primary : colors.border, backgroundColor: quietHour === h ? colors.primaryLight : colors.background }]}
              onPress={() => { setQuietHour(h); setShowQuietHoursSheet(false); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); toast.show(`Quiet hours set to ${h}`, "info"); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.sheetOptionText, { color: quietHour === h ? colors.primary : colors.text }]}>{h}</Text>
              {quietHour === h && <Feather name="check" size={16} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>

      {/* Logout Confirmation Sheet */}
      <BottomSheet visible={showLogoutSheet} onClose={() => setShowLogoutSheet(false)} title="Sign Out" snapHeight={320}>
        <View style={styles.sheetBody}>
          <View style={[styles.logoutWarning, { backgroundColor: colors.destructiveLight }]}>
            <Feather name="alert-circle" size={24} color={colors.destructive} />
            <Text style={[styles.logoutWarningText, { color: colors.destructive }]}>
              You'll need to sign in again to access your account.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: colors.destructive }]}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Feather name="log-out" size={16} color="#fff" />
            <Text style={styles.logoutBtnText}>Sign Out This Device</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.logoutAllBtn, { borderColor: colors.border }]}
            onPress={handleLogoutAll}
            activeOpacity={0.8}
          >
            <Feather name="monitor" size={14} color={colors.mutedForeground} />
            <Text style={[styles.logoutAllText, { color: colors.mutedForeground }]}>Sign Out All Devices</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowLogoutSheet(false)} style={styles.cancelLogout}>
            <Text style={[styles.cancelLogoutText, { color: colors.mutedForeground }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 18, fontFamily: "Inter_700Bold" },
  scroll: { padding: 16, gap: 16 },
  profileCard: { overflow: "hidden" },
  cover: { height: 80 },
  profileBody: { padding: 16, gap: 6 },
  profileAvatarRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: -36, marginBottom: 8 },
  profileAvatarWrap: { borderRadius: 40, borderWidth: 3, position: "relative", overflow: "visible" },
  profilePhoto: { width: 72, height: 72, borderRadius: 36 },
  cameraBtn: { position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  editBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  profileName: { fontSize: 18, fontFamily: "Inter_700Bold" },
  profileRole: { fontSize: 12, fontFamily: "Inter_400Regular" },
  profileBadges: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 },
  completenessRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, marginTop: 10, paddingTop: 10 },
  completenessLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  completenessValue: { fontSize: 11, fontFamily: "Inter_700Bold" },
  progressTrack: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  group: { gap: 8 },
  groupLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8, paddingHorizontal: 4 },
  settingRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12, borderBottomWidth: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  settingInfo: { flex: 1, gap: 1 },
  settingLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  settingSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  settingValue: { fontSize: 13, fontFamily: "Inter_400Regular" },
  faqRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderBottomWidth: 1 },
  faqQ: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", paddingRight: 12 },
  faqAnswer: { paddingHorizontal: 14, paddingVertical: 10 },
  faqA: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  footer: { borderTopWidth: 1, paddingTop: 16, alignItems: "center", gap: 4 },
  footerText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  sheetList: { gap: 8 },
  sheetOption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderWidth: 1.5, borderRadius: 12 },
  sheetOptionText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  sheetBody: { gap: 12 },
  logoutWarning: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14 },
  logoutWarningText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 20 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 50, borderRadius: 14 },
  logoutBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#fff" },
  logoutAllBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 46, borderRadius: 14, borderWidth: 1.5 },
  logoutAllText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  cancelLogout: { alignItems: "center", paddingVertical: 8 },
  cancelLogoutText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
