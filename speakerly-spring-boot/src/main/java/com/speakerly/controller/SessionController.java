package com.speakerly.controller;

import com.speakerly.entity.Session;
import com.speakerly.entity.User;
import com.speakerly.repository.UserRepository;
import com.speakerly.security.CustomUserDetails;
import com.speakerly.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/start")
    public ResponseEntity<Map<String, Object>> startSession(Authentication auth, @RequestBody Map<String, Long> payload) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Long bookingId = payload.get("bookingId");
        return ResponseEntity.ok(sessionService.startSession(bookingId, userDetails.getId()));
    }

    @PostMapping("/end")
    public ResponseEntity<Session> endSession(@RequestBody Map<String, Long> payload) {
        Long sessionId = payload.get("sessionId");
        return ResponseEntity.ok(sessionService.endSession(sessionId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Session>> getSessionHistory(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        return ResponseEntity.ok(sessionService.getUserHistory(user));
    }
}
