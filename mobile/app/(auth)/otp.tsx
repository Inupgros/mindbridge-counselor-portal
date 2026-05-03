import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OTPScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 200);
  }, []);

  useEffect(() => {
    if (timer <= 0) { setCanResend(true); return; }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push("/(auth)/onboarding");
    }, 1200);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(RESEND_SECONDS);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad, paddingBottom: bottomPad + 20 }]}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Feather name="arrow-left" size={20} color={colors.text} />
      </TouchableOpacity>

      <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
          <Feather name="message-square" size={28} color={colors.primary} />
        </Animated.View>

        <Animated.Text entering={FadeInDown.delay(150).duration(400)} style={[styles.title, { color: colors.text }]}>
          Verify your number
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(200).duration(400)} style={[styles.sub, { color: colors.mutedForeground }]}>
          We sent a 6-digit code to your registered mobile number
        </Animated.Text>

        {/* OTP inputs */}
        <Animated.View entering={FadeInDown.delay(250).duration(400)} style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              style={[
                styles.otpCell,
                {
                  borderColor: digit ? colors.primary : colors.border,
                  backgroundColor: digit ? colors.primaryLight : colors.card,
                  color: colors.text,
                  fontFamily: "Inter_700Bold",
                },
              ]}
              value={digit}
              onChangeText={(v) => handleChange(i, v)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {/* Resend */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.resendRow}>
          <Text style={[styles.resendText, { color: colors.mutedForeground }]}>
            Didn't receive it?{" "}
          </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[styles.resendLink, { color: colors.primary }]}>Resend code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.resendTimer, { color: colors.text }]}>
              {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
            </Text>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(350).duration(400)} style={styles.fullWidth}>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary, opacity: isVerifying ? 0.7 : 1 }]}
            onPress={handleVerify}
            disabled={isVerifying}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>{isVerifying ? "Verifying..." : "Verify Code"}</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={[styles.secureRow, { backgroundColor: colors.primaryLight }]}>
          <Feather name="lock" size={14} color={colors.primary} />
          <Text style={[styles.secureText, { color: colors.primary }]}>Secure encrypted verification</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24 },
  backBtn: { padding: 8, alignSelf: "flex-start", marginBottom: 16 },
  fullWidth: { width: "100%" },
  content: { flex: 1, alignItems: "center", paddingTop: 20 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", marginBottom: 8, textAlign: "center" },
  sub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22, marginBottom: 36, paddingHorizontal: 20 },
  otpRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  otpCell: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 22,
  },
  resendRow: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
  resendText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  resendLink: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  resendTimer: { fontSize: 13, fontFamily: "Inter_700Bold" },
  primaryBtn: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    width: "100%",
    justifyContent: "center",
  },
  secureText: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
