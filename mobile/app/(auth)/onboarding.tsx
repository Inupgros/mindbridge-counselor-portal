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
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Input } from "@/components/ui/Input";
import { useColors } from "@/hooks/useColors";

const STEPS = ["Personal Info", "Qualifications", "Specialization", "Documents", "Review"];

const SPECIALIZATION_OPTIONS = [
  "Career Counseling", "Academic Coaching", "Mental Health Support",
  "Stress Management", "College Admission Guidance", "Behavioral Therapy",
];

const DOCUMENT_OPTIONS = [
  { key: "degree", label: "Degree Certificate", icon: "file-text" as const, required: true },
  { key: "rci", label: "RCI Registration", icon: "shield" as const, required: true },
  { key: "id", label: "Government Photo ID", icon: "credit-card" as const, required: true },
  { key: "photo", label: "Professional Photo", icon: "camera" as const, required: false },
  { key: "experience", label: "Experience Certificate", icon: "briefcase" as const, required: false },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [qualification, setQualification] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [experience, setExperience] = useState("");
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);

  const toggleSpec = (spec: string) => {
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleUploadDoc = async (key: string) => {
    if (Platform.OS === "web") {
      // Web: just mark as uploaded with a placeholder
      setUploadedDocs((prev) => ({ ...prev, [key]: "web-upload" }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Please allow access to your photo library to upload documents.");
      return;
    }

    setUploading(key);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 0.85,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setUploadedDocs((prev) => ({ ...prev, [key]: uri }));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveDoc = (key: string) => {
    setUploadedDocs((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const next = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else router.push("/(auth)/status");
  };

  const prev = () => {
    if (step > 0) setStep((s) => s - 1);
    else router.back();
  };

  const requiredDocs = DOCUMENT_OPTIONS.filter((d) => d.required);
  const allRequiredUploaded = requiredDocs.every((d) => uploadedDocs[d.key]);
  const uploadedCount = Object.keys(uploadedDocs).length;
  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={prev} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile Setup</Text>
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>Step {step + 1} of {STEPS.length}</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFillBase, { backgroundColor: colors.primary, width: `${progressPct}%` }]} />
      </View>

      {/* Step dots */}
      <View style={styles.stepDots}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.stepDot,
              { backgroundColor: i <= step ? colors.primary : colors.border, width: i === step ? 20 : 8 },
            ]}
          />
        ))}
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.Text
          entering={FadeInDown.duration(300)}
          key={`title-${step}`}
          style={[styles.stepTitle, { color: colors.text }]}
        >
          {STEPS[step]}
        </Animated.Text>

        {step === 0 && (
          <Animated.View entering={FadeInDown.delay(60).duration(300)} key="step0" style={styles.fields}>
            <Input label="Full Name" placeholder="Dr. Ananya Sharma" value={name} onChangeText={setName} containerStyle={styles.field} leftIcon={<Feather name="user" size={16} color={colors.mutedForeground} />} />
            <Input label="Mobile Number" placeholder="+91 9876543210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" containerStyle={styles.field} leftIcon={<Feather name="phone" size={16} color={colors.mutedForeground} />} />
            <Input label="City" placeholder="Delhi" value={city} onChangeText={setCity} containerStyle={styles.field} leftIcon={<Feather name="map-pin" size={16} color={colors.mutedForeground} />} />
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View entering={FadeInDown.delay(60).duration(300)} key="step1" style={styles.fields}>
            <Input label="Highest Qualification" placeholder="M.Sc. Psychology" value={qualification} onChangeText={setQualification} containerStyle={styles.field} leftIcon={<Feather name="book" size={16} color={colors.mutedForeground} />} />
            <Input label="RCI Registration Number" placeholder="RCI/2019/DEL/04521" value={regNumber} onChangeText={setRegNumber} containerStyle={styles.field} leftIcon={<Feather name="hash" size={16} color={colors.mutedForeground} />} />
            <Input label="Years of Experience" placeholder="6" value={experience} onChangeText={setExperience} keyboardType="number-pad" containerStyle={styles.field} leftIcon={<Feather name="briefcase" size={16} color={colors.mutedForeground} />} />
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInDown.delay(60).duration(300)} key="step2" style={styles.fields}>
            <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>Select your areas of expertise (choose all that apply)</Text>
            <View style={styles.specGrid}>
              {SPECIALIZATION_OPTIONS.map((spec) => {
                const active = selectedSpecs.includes(spec);
                return (
                  <TouchableOpacity
                    key={spec}
                    style={[styles.specChip, { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primaryLight : colors.card }]}
                    onPress={() => toggleSpec(spec)}
                    activeOpacity={0.8}
                  >
                    {active && <Feather name="check" size={12} color={colors.primary} />}
                    <Text style={[styles.specText, { color: active ? colors.primary : colors.text }]}>{spec}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeInDown.delay(60).duration(300)} key="step3" style={styles.fields}>
            <Text style={[styles.specLabel, { color: colors.mutedForeground }]}>
              Tap each document to pick a file from your library. Required documents must be uploaded to continue.
            </Text>
            <View style={styles.docList}>
              {DOCUMENT_OPTIONS.map((doc) => {
                const uri = uploadedDocs[doc.key];
                const uploaded = !!uri;
                const isLoading = uploading === doc.key;
                return (
                  <TouchableOpacity
                    key={doc.key}
                    style={[
                      styles.docRow,
                      { backgroundColor: uploaded ? colors.successLight : colors.card, borderColor: uploaded ? colors.success : colors.border },
                    ]}
                    onPress={() => uploaded ? handleRemoveDoc(doc.key) : handleUploadDoc(doc.key)}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.docIconWrap, { backgroundColor: uploaded ? colors.success + "20" : colors.primaryLight }]}>
                      {uploaded && uri !== "web-upload" ? (
                        <Image source={{ uri }} style={styles.docThumb} contentFit="cover" />
                      ) : (
                        <Feather name={doc.icon} size={18} color={uploaded ? colors.success : colors.primary} />
                      )}
                    </View>
                    <View style={styles.docInfo}>
                      <Text style={[styles.docLabel, { color: uploaded ? colors.successForeground : colors.text }]}>{doc.label}</Text>
                      <Text style={[styles.docRequired, { color: doc.required ? colors.warning : colors.mutedForeground }]}>
                        {uploaded ? "Tap to remove" : doc.required ? "Required — tap to upload" : "Optional — tap to upload"}
                      </Text>
                    </View>
                    <View style={[styles.docStatusBtn, { backgroundColor: uploaded ? colors.success : isLoading ? colors.muted : colors.border }]}>
                      {isLoading ? (
                        <Feather name="loader" size={14} color={colors.mutedForeground} />
                      ) : (
                        <Feather name={uploaded ? "check" : "upload"} size={14} color={uploaded ? "#fff" : colors.mutedForeground} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={[styles.docProgressRow, { backgroundColor: colors.muted, borderRadius: 12, padding: 12 }]}>
              <View style={[styles.docProgressBar, { backgroundColor: colors.border }]}>
                <View style={[styles.docProgressFill, { backgroundColor: colors.primary, width: `${(uploadedCount / DOCUMENT_OPTIONS.length) * 100}%` as const }]} />
              </View>
              <Text style={[styles.docProgressText, { color: colors.mutedForeground }]}>
                {uploadedCount}/{DOCUMENT_OPTIONS.length} uploaded · {requiredDocs.length - requiredDocs.filter((d) => uploadedDocs[d.key]).length} required remaining
              </Text>
            </View>
            {!allRequiredUploaded && (
              <View style={[styles.docNote, { backgroundColor: colors.warningLight, borderColor: colors.warning + "30" }]}>
                <Feather name="alert-triangle" size={14} color={colors.warning} />
                <Text style={[styles.docNoteText, { color: colors.warningForeground }]}>
                  All 3 required documents must be uploaded before you can proceed.
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {step === 4 && (
          <Animated.View entering={FadeInDown.delay(60).duration(300)} key="step4" style={styles.fields}>
            <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.reviewHeader, { backgroundColor: colors.primaryLight }]}>
                <View style={[styles.reviewAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.reviewAvatarText}>{name ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "AS"}</Text>
                </View>
                <View>
                  <Text style={[styles.reviewName, { color: colors.text }]}>{name || "Dr. Ananya Sharma"}</Text>
                  <Text style={[styles.reviewRole, { color: colors.mutedForeground }]}>Licensed Counselor Applicant</Text>
                </View>
              </View>
              {[
                { label: "City", value: city || "Delhi" },
                { label: "Qualification", value: qualification || "M.Sc. Psychology" },
                { label: "RCI Number", value: regNumber || "RCI/2019/DEL/04521" },
                { label: "Experience", value: experience ? `${experience} years` : "6 years" },
                { label: "Specializations", value: selectedSpecs.length > 0 ? selectedSpecs.join(", ") : "Career Counseling" },
                { label: "Documents", value: `${uploadedCount}/${DOCUMENT_OPTIONS.length} uploaded` },
              ].map((item) => (
                <View key={item.label} style={[styles.reviewRow, { borderTopColor: colors.border }]}>
                  <Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
                  <Text style={[styles.reviewValue, { color: colors.text }]}>{item.value}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.submitNote, { backgroundColor: colors.successLight, borderColor: colors.success + "30" }]}>
              <Feather name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.submitNoteText, { color: colors.successForeground }]}>
                Your profile will be reviewed by MindBridge. You'll be notified once approved (1–3 business days).
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Bottom button */}
      <View style={[styles.footer, { paddingBottom: bottomPad + 16, borderTopColor: colors.border, backgroundColor: colors.background }]}>
        {step === 3 && !allRequiredUploaded ? (
          <View style={[styles.nextBtn, { backgroundColor: colors.muted }]}>
            <Text style={[styles.nextBtnText, { color: colors.mutedForeground }]}>Upload Required Documents</Text>
          </View>
        ) : (
          <TouchableOpacity style={[styles.nextBtn, { backgroundColor: colors.primary }]} onPress={next} activeOpacity={0.85}>
            <Text style={styles.nextBtnText}>{step === STEPS.length - 1 ? "Submit Application" : "Continue"}</Text>
            <Feather name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  progressTrack: { height: 4, marginHorizontal: 16, borderRadius: 2, overflow: "hidden" },
  progressFillBase: { height: "100%", borderRadius: 2 },
  stepDots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 6, paddingVertical: 12 },
  stepDot: { height: 8, borderRadius: 4 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  stepTitle: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 20 },
  fields: { gap: 4 },
  field: { marginBottom: 14 },
  specLabel: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 14, lineHeight: 20 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  specChip: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9 },
  specText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  docList: { gap: 10, marginBottom: 14 },
  docRow: { flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1.5, borderRadius: 14, padding: 14 },
  docIconWrap: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  docThumb: { width: 44, height: 44, borderRadius: 13 },
  docInfo: { flex: 1 },
  docLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  docRequired: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 2 },
  docStatusBtn: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  docProgressRow: { gap: 8 },
  docProgressBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  docProgressFill: { height: "100%", borderRadius: 3 },
  docProgressText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  docNote: { flexDirection: "row", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, alignItems: "flex-start", marginTop: 4 },
  docNoteText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  reviewCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  reviewAvatar: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  reviewAvatarText: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#fff" },
  reviewName: { fontSize: 16, fontFamily: "Inter_700Bold" },
  reviewRole: { fontSize: 12, fontFamily: "Inter_400Regular" },
  reviewRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1 },
  reviewLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  reviewValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", flex: 1, textAlign: "right" },
  submitNote: { flexDirection: "row", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: "flex-start", marginTop: 16 },
  submitNoteText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  footer: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1 },
  nextBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, height: 52, borderRadius: 14, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  nextBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold", color: "#fff" },
});
