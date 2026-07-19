package com.fitconnect.backend.controller;

import com.fitconnect.backend.dto.PaymentRequest;
import com.fitconnect.backend.service.PaystackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaystackService paystackService;

    @PostMapping("/initialize")
    public ResponseEntity<?> initializePayment(@RequestBody PaymentRequest request) {
        String authUrl = paystackService.initializePayment(request);
        return ResponseEntity.ok(Map.of("authorization_url", authUrl));
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestHeader("x-paystack-signature") String signature, @RequestBody String payload) {
        // Logic: Verify HMAC signature here using secret key
        // Then update your database: User is now 'PREMIUM'
        System.out.println("Webhook received: " + payload);
        return ResponseEntity.ok("Webhook Received");
    }
}