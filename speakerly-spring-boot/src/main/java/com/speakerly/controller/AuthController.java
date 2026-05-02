package com.speakerly.controller;

import com.speakerly.dto.ApiResponse;
import com.speakerly.dto.AuthRequest;
import com.speakerly.dto.AuthResponse;
import com.speakerly.dto.RegisterRequest;
import com.speakerly.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(new ApiResponse(true, "Registration successful"));
    }
}
