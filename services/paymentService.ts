import API from "./client";

export interface PaymentRequest {
  email: string;
  amount: number;
}

export interface PaymentInitResponse {
  authorization_url?: string;
  htmlContent?: string;
}

export const PAYSTACK_PUBLIC_KEY =
  process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ||
  "pk_live_53ab1be6e74f7c649341e11e377e376442e87d0c";

export const generatePaystackHtml = (
  publicKey: string,
  email: string,
  amountInGhs: number,
  reference: string,
): string => {
  const amountInPesewas = Math.round(amountInGhs * 100);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Paystack Checkout</title>
  <script src="https://js.paystack.co/v1/inline.js"></script>
  <style>
    * { box-sizing: border-box; }
    body, html {
      margin: 0; padding: 0; width: 100%; height: 100%;
      display: flex; justify-content: center; align-items: center;
      background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .loading-container { text-align: center; color: #4B5563; }
    .spinner {
      width: 40px; height: 40px; border: 4px solid #E5E7EB;
      border-top: 4px solid #4CAF50; border-radius: 50%;
      animation: spin 1s linear infinite; margin: 0 auto 16px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="loading-container">
    <div class="spinner"></div>
    <p style="font-size:16px; font-weight:600;">Opening Paystack Payment...</p>
  </div>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      try {
        var handler = PaystackPop.setup({
          key: "${publicKey}",
          email: "${email}",
          amount: ${amountInPesewas},
          currency: "GHS",
          ref: "${reference}",
          onClose: function() {
            window.location.href = "https://standard.paystack.co/close?status=cancelled&reference=${reference}";
          },
          callback: function(response) {
            var ref = (response && response.reference) ? response.reference : "${reference}";
            window.location.href = "https://standard.paystack.co/close?status=success&reference=" + encodeURIComponent(ref);
          }
        });
        handler.openIframe();
      } catch (err) {
        console.error("Paystack setup error:", err);
      }
    });
  </script>
</body>
</html>`;
};

export const initializePayment = async (
  data: PaymentRequest,
): Promise<PaymentInitResponse> => {
  // 1. First attempt to initialize payment through the backend API if configured
  try {
    const response = await API.post<any>("/payments/initialize", data);
    const authUrl =
      response?.data?.authorization_url ||
      response?.data?.data?.authorization_url;

    if (authUrl && !authUrl.includes("demo_")) {
      return { authorization_url: authUrl };
    }
  } catch (error) {
    console.warn("Backend payment initialization skipped or unavailable, using client-side Paystack inline checkout...");
  }

  // 2. Client-side Paystack Inline checkout using public key
  const ref = "FC-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  const htmlContent = generatePaystackHtml(
    PAYSTACK_PUBLIC_KEY,
    data.email,
    data.amount,
    ref,
  );

  return { htmlContent };
};