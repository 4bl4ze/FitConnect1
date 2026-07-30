import API from "./client";

// Matches PaymentRequest DTO on Spring Boot
export interface PaymentRequest {
  email: string;
  amount: number;
  callbackUrl?: string; // Optional deep link back to your app
}

// Matches response structure returned by PaymentController
export interface PaymentInitResponse {
  authorization_url: string;
}

/**
 * 1. INITIALIZE PAYMENT
 * Sends payment details to Spring Boot -> Returns Paystack checkout URL
 */
export const initializePayment = async (data: PaymentRequest): Promise<PaymentInitResponse> => {
  const response = await API.post<PaymentInitResponse>("/payments/initialize", data);
  return response.data;
};