import { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import WebView, { type WebViewNavigation } from "react-native-webview";

import { ThemedText } from "@/components/themed-text";

interface PaystackCheckoutProps {
  visible: boolean;
  authorizationUrl?: string | null;
  htmlContent?: string | null;
  /** Optional: if your backend sets a callback_url on init, pass its base
   *  here (e.g. "https://fitconnect-backend-kyfw.onrender.com/api/payments/callback")
   *  so we can detect it precisely. If omitted we fall back to Paystack's
   *  default close/success URL patterns. */
  callbackUrlPrefix?: string;
  onClose: () => void;
  /** Called once with the reference when we detect a completed checkout. */
  onSuccess: (reference: string | null) => void;
  /** Called if the user backs out without paying. */
  onCancel: () => void;
}

// Paystack's own hosted checkout ends up here (or shows a "close" screen)
// when no callback_url is configured server-side.
const DEFAULT_SUCCESS_PATTERNS = [
  "standard.paystack.co/close",
  "checkout.paystack.com/close",
  "paystack.co/close",
  "payment/success",
  "callback",
];

function extractReference(url: string): string | null {
  try {
    const parsed = new URL(url);
    return (
      parsed.searchParams.get("reference") ?? parsed.searchParams.get("trxref")
    );
  } catch {
    return null;
  }
}

export function PaystackCheckout({
  visible,
  authorizationUrl,
  htmlContent,
  callbackUrlPrefix,
  onClose,
  onSuccess,
  onCancel,
}: PaystackCheckoutProps) {
  const [loading, setLoading] = useState(true);
  const handledRef = useRef(false);

  const isSuccessUrl = useCallback(
    (url: string) => {
      if (callbackUrlPrefix && url.startsWith(callbackUrlPrefix)) return true;
      return DEFAULT_SUCCESS_PATTERNS.some((pattern) => url.includes(pattern));
    },
    [callbackUrlPrefix],
  );

  const handleNavChange = useCallback(
    (navState: WebViewNavigation) => {
      const { url } = navState;
      if (!url || handledRef.current) return;

      if (isSuccessUrl(url)) {
        handledRef.current = true;
        const reference = extractReference(url);
        onSuccess(reference);
      }
    },
    [isSuccessUrl, onSuccess],
  );

  // Prevents the WebView from actually navigating to the callback URL
  // (which likely 404s or is meant for server-to-server use) — we just
  // want to observe it, then close.
  const handleShouldStartLoad = useCallback(
    (request: { url: string }) => {
      if (isSuccessUrl(request.url)) {
        if (!handledRef.current) {
          handledRef.current = true;
          onSuccess(extractReference(request.url));
        }
        return false;
      }
      return true;
    },
    [isSuccessUrl, onSuccess],
  );

  const handleClose = useCallback(() => {
    handledRef.current = false;
    setLoading(true);
    if (!handledRef.current) {
      onCancel();
    }
    onClose();
  }, [onCancel, onClose]);

  const webViewSource = authorizationUrl
    ? { uri: authorizationUrl }
    : htmlContent
    ? { html: htmlContent, baseUrl: "https://checkout.paystack.com" }
    : null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">Checkout</ThemedText>
        <Pressable onPress={handleClose} hitSlop={12}>
          <ThemedText style={styles.closeText}>Close</ThemedText>
        </Pressable>
      </View>

      {webViewSource ? (
        <View style={styles.webviewWrapper}>
          <WebView
            source={webViewSource}
            onNavigationStateChange={handleNavChange}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            onLoadEnd={() => setLoading(false)}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={["*"]}
            style={styles.webview}
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <ThemedText style={styles.loadingText}>
                Loading secure checkout…
              </ThemedText>
            </View>
          )}
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D1D5DB",
  },
  closeText: {
    color: "#EF4444",
    fontWeight: "600",
  },
  webviewWrapper: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
  },
});
