package com.speakerly.controller;

import com.speakerly.security.CustomUserDetails;
import com.speakerly.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @GetMapping("/daily")
    public ResponseEntity<Map<String, Object>> getDailyProgress(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(progressService.getDailyProgress(userDetails.getId()));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(progressService.getSummary(userDetails.getId()));
    }
}
