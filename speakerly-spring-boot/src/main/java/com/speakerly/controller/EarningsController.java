package com.speakerly.controller;

import com.speakerly.entity.Earnings;
import com.speakerly.security.CustomUserDetails;
import com.speakerly.service.EarningsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/earnings")
public class EarningsController {

    @Autowired
    private EarningsService earningsService;

    @GetMapping("/history")
    public ResponseEntity<List<Earnings>> getEarningsHistory(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(earningsService.getTrainerEarnings(userDetails.getId()));
    }
}
