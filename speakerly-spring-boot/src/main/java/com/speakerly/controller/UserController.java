package com.speakerly.controller;

import com.speakerly.entity.User;
import com.speakerly.repository.UserRepository;
import com.speakerly.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(userRepository.findById(userDetails.getId()).orElseThrow());
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(Authentication auth, @RequestBody User updateDetails) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        if (updateDetails.getName() != null) user.setName(updateDetails.getName());
        if (updateDetails.getEmail() != null) user.setEmail(updateDetails.getEmail());
        return ResponseEntity.ok(userRepository.save(user));
    }
}
