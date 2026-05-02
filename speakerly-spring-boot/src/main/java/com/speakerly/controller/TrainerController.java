package com.speakerly.controller;

import com.speakerly.entity.Availability;
import com.speakerly.entity.Trainer;
import com.speakerly.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @GetMapping
    public ResponseEntity<List<Trainer>> getApprovedTrainers() {
        return ResponseEntity.ok(trainerService.getApprovedTrainers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trainer> getTrainer(@PathVariable Long id) {
        return ResponseEntity.ok(trainerService.getTrainer(id));
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<List<Availability>> getTrainerSlots(@PathVariable Long id) {
        return ResponseEntity.ok(trainerService.getTrainerSlots(id));
    }

    @PutMapping("/profile")
    public ResponseEntity<Trainer> updateProfile(Authentication auth, @RequestBody Trainer updateDetails) {
        com.speakerly.security.CustomUserDetails userDetails = (com.speakerly.security.CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(trainerService.updateProfile(userDetails.getId(), updateDetails));
    }

    @PostMapping("/availability")
    public ResponseEntity<List<Availability>> setAvailability(Authentication auth, @RequestBody List<Availability> availabilities) {
        com.speakerly.security.CustomUserDetails userDetails = (com.speakerly.security.CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(trainerService.setAvailability(userDetails.getId(), availabilities));
    }
}
