import React, { useCallback, useEffect } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  snapHeight?: number;
  style?: ViewStyle;
}

export function BottomSheet({ visible, onClose, title, children, snapHeight = 480, style }: BottomSheetProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 20 : insets.bottom;

  const translateY = useSharedValue(snapHeight);
  const backdropOpacity = useSharedValue(0);

  const open = useCallback(() => {
    backdropOpacity.value = withTiming(1, { duration: 250 });
    translateY.value = withSpring(0, { damping: 22, stiffness: 180 });
  }, []);

  const close = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(snapHeight, { duration: 220 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  }, [snapHeight, onClose]);

  useEffect(() => {
    if (visible) open();
  }, [visible]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={close} statusBarTranslucent>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={close}>
          <Animated.View style={[styles.backdrop, backdropStyle]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.card, paddingBottom: bottomPad + 16 },
            sheetStyle,
            style,
          ]}
        >
          {/* Handle */}
          <View style={styles.handleRow}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity onPress={close} style={styles.closeBtn}>
              <Text style={[styles.closeX, { color: colors.mutedForeground }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  handleRow: { alignItems: "center", paddingTop: 12, paddingBottom: 4 },
  handle: { width: 36, height: 4, borderRadius: 2 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 17, fontFamily: "Inter_700Bold" },
  closeBtn: { padding: 4 },
  closeX: { fontSize: 16, fontFamily: "Inter_500Medium" },
  content: { paddingHorizontal: 20, paddingTop: 16 },
});
