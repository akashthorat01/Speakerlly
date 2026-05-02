package com.speakerly.controller;

import com.speakerly.entity.Trainer;
import com.speakerly.entity.User;
import com.speakerly.repository.TrainerRepository;
import com.speakerly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/trainers")
    public ResponseEntity<List<Trainer>> getAllTrainers() {
        return ResponseEntity.ok(trainerRepository.findAll());
    }

    @PutMapping("/trainers/{id}/approve")
    public ResponseEntity<Trainer> approveTrainer(@PathVariable Long id) {
        Trainer trainer = trainerRepository.findById(id).orElseThrow();
        trainer.setIsApproved(true);
        return ResponseEntity.ok(trainerRepository.save(trainer));
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalTrainers", trainerRepository.count());
        return ResponseEntity.ok(analytics);
    }
}
