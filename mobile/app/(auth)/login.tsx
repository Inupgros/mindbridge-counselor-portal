import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { useColors } from "@/hooks/useColors";

type Tab = "login" | "register";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mobile, setMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const handleLogin = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await login();
    router.replace("/(tabs)");
  };

  const handleRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(auth)/otp");
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: topPad + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={[styles.logoBox, { backgroundColor: colors.primary }]}>
            <Feather name="shield" size={22} color="#fff" />
          </View>
          <View>
            <Text style={[styles.logoName, { color: colors.text }]}>MindBridge</Text>
            <Text style={[styles.logoTagline, { color: colors.mutedForeground }]}>Counselor Portal</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            {tab === "login" ? "Welcome back" : "Join MindBridge"}
          </Text>
          <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
            {tab === "login"
              ? "Sign in to manage your practice"
              : "Apply for a counselor account"}
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={[styles.tabBar, { backgroundColor: colors.muted }]}>
          {(["login", "register"] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && [styles.tabBtnActive, { backgroundColor: colors.card }]]}
              onPress={() => setTab(t)}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabBtnText, { color: tab === t ? colors.text : colors.mutedForeground }]}>
                {t === "login" ? "Login" : "Register"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          {tab === "login" ? (
            <>
              <Input
                label="Email Address"
                placeholder="dr.smith@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Feather name="mail" size={16} color={colors.mutedForeground} />}
                containerStyle={styles.inputGap}
              />
              <Input
                label="Password"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                leftIcon={<Feather name="lock" size={16} color={colors.mutedForeground} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                    <Feather name={showPassword ? "eye-off" : "eye"} size={16} color={colors.mutedForeground} />
                  </TouchableOpacity>
                }
                containerStyle={styles.inputGap}
              />
              <TouchableOpacity style={styles.forgotRow}>
                <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                onPress={handleLogin}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Sign In</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Input
                label="Mobile Number"
                placeholder="+91 9876543210"
                keyboardType="phone-pad"
                value={mobile}
                onChangeText={setMobile}
                leftIcon={<Feather name="phone" size={16} color={colors.mutedForeground} />}
                containerStyle={styles.inputGap}
              />
              <Input
                label="Work Email"
                placeholder="dr.smith@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={regEmail}
                onChangeText={setRegEmail}
                leftIcon={<Feather name="mail" size={16} color={colors.mutedForeground} />}
                containerStyle={styles.inputGap}
              />
              <Input
                label="Create Password"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={regPassword}
                onChangeText={setRegPassword}
                leftIcon={<Feather name="lock" size={16} color={colors.mutedForeground} />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
                    <Feather name={showPassword ? "eye-off" : "eye"} size={16} color={colors.mutedForeground} />
                  </TouchableOpacity>
                }
                containerStyle={styles.inputGap}
              />
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                onPress={handleRegister}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Submit Application</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Trust badges */}
        <View style={[styles.trustRow, { borderTopColor: colors.border }]}>
          {[
            { icon: "check-circle" as const, label: "HIPAA Compliant" },
            { icon: "shield" as const, label: "256-bit SSL" },
            { icon: "clock" as const, label: "24/7 Support" },
          ].map((item) => (
            <View key={item.label} style={styles.trustItem}>
              <Feather name={item.icon} size={14} color={colors.mutedForeground} />
              <Text style={[styles.trustText, { color: colors.mutedForeground }]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoName: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  logoTagline: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  hero: {
    marginBottom: 28,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabBtnActive: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  form: {
    gap: 4,
    marginBottom: 32,
  },
  inputGap: {
    marginBottom: 14,
  },
  forgotRow: {
    alignItems: "flex-end",
    marginBottom: 20,
    marginTop: -6,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  primaryBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  trustRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    paddingTop: 20,
  },
  trustItem: {
    alignItems: "center",
    gap: 4,
  },
  trustText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
