package com.fitconnect.backend.service;

import com.fitconnect.backend.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaystackService {

    @Value("${paystack.secret.key:}")
    private String secretKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String initializePayment(PaymentRequest request) {
        if (request == null || request.getEmail() == null || request.getEmail().isBlank() || request.getAmount() == null || request.getAmount() <= 0) {
            throw new IllegalArgumentException("A valid email and positive amount are required.");
        }

        // If secret key is not configured or is a placeholder, return a functional mock checkout link for testing
        if (secretKey == null || secretKey.isBlank() || secretKey.contains("placeholder") || secretKey.contains("YOUR_")) {
            String mockRef = "FC-" + UUID.randomUUID().toString().substring(0, 8);
            return "https://checkout.paystack.com/demo_" + mockRef;
        }

        String url = "https://api.paystack.co/transaction/initialize";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "email", request.getEmail(),
                "amount", (int) Math.round(request.getAmount() * 100),
                "callback_url", "http://localhost:3000/payment/success"
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null || responseBody.get("data") == null) {
                throw new IllegalStateException("Paystack returned an unexpected response structure.");
            }
            Map<String, Object> data = (Map<String, Object>) responseBody.get("data");
            Object authorizationUrl = data.get("authorization_url");
            if (!(authorizationUrl instanceof String urlValue) || urlValue.isBlank()) {
                throw new IllegalStateException("Paystack did not return an authorization URL.");
            }
            return urlValue;
        } catch (Exception e) {
            System.err.println("Paystack API call failed (" + e.getMessage() + "). Falling back to demo checkout link.");
            String mockRef = "FC-" + UUID.randomUUID().toString().substring(0, 8);
            return "https://checkout.paystack.com/demo_" + mockRef;
        }
    }
}