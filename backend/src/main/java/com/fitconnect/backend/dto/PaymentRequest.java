package com.fitconnect.backend.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private String email;
    private Double amount;
}