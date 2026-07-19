package com.fitconnect.backend.service;

import com.fitconnect.backend.dto.PaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaystackService {

    @Value("${paystack.secret.key}")
    private String secretKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String initializePayment(PaymentRequest request) {
        String url = "https://api.paystack.co/transaction/initialize";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Paystack expects amount in Kobo (e.g., 1000 Naira = 100,000 kobo)
        Map<String, Object> body = Map.of(
                "email", request.getEmail(),
                "amount", (int) (request.getAmount() * 100),
                "callback_url", "http://localhost:3000/payment/success"
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
        return (String) data.get("authorization_url");
    }
}