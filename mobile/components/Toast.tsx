import { useCallback } from "react";
import RNToast from "react-native-toast-message";

export type ToastVariant = "success" | "error" | "info" | "warning";

const VARIANT_TO_TYPE: Record<ToastVariant, "success" | "error" | "info"> = {
  success: "success",
  error: "error",
  info: "info",
  warning: "info",
};

export function useToast() {
  const show = useCallback((message: string, variant: ToastVariant = "info") => {
    RNToast.show({
      type: VARIANT_TO_TYPE[variant],
      text1: message,
      position: "bottom",
      visibilityTime: 3000,
    });
  }, []);

  return { show };
}
