package com.speakerly.controller;

import com.speakerly.entity.Payment;
import com.speakerly.security.CustomUserDetails;
import com.speakerly.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(Authentication auth, @RequestBody Map<String, String> payload) throws Exception {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String planType = payload.get("planType");
        return ResponseEntity.ok(paymentService.createOrder(userDetails.getId(), planType));
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(Authentication auth, @RequestBody Map<String, String> payload) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(paymentService.verifyPayment(
                userDetails.getId(),
                payload.get("razorpayOrderId"),
                payload.get("razorpayPaymentId"),
                payload.get("razorpaySignature"),
                payload.get("planType")
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Payment>> getPaymentHistory(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(paymentService.getPaymentHistory(userDetails.getId()));
    }
}
