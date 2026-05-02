package com.speakerly.controller;

import com.speakerly.entity.Rating;
import com.speakerly.entity.Session;
import com.speakerly.entity.Trainer;
import com.speakerly.entity.User;
import com.speakerly.repository.RatingRepository;
import com.speakerly.repository.SessionRepository;
import com.speakerly.repository.TrainerRepository;
import com.speakerly.repository.UserRepository;
import com.speakerly.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @PostMapping("/submit")
    public ResponseEntity<Rating> submitRating(Authentication auth, @RequestBody Map<String, Object> payload) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        
        Long sessionId = Long.valueOf(payload.get("sessionId").toString());
        Integer stars = Integer.valueOf(payload.get("stars").toString());
        String review = payload.get("review").toString();

        Session session = sessionRepository.findById(sessionId).orElseThrow();
        Trainer trainer = session.getTrainer();

        Rating rating = new Rating();
        rating.setUser(user);
        rating.setTrainer(trainer);
        rating.setSession(session);
        rating.setStars(stars);
        rating.setReview(review);
        ratingRepository.save(rating);

        // Update trainer average rating
        List<Rating> allRatings = ratingRepository.findByTrainer(trainer);
        double avg = allRatings.stream().mapToInt(Rating::getStars).average().orElse(0.0);
        trainer.setRatingAvg(new BigDecimal(avg).setScale(2, RoundingMode.HALF_UP));
        trainerRepository.save(trainer);

        return ResponseEntity.ok(rating);
    }

    @GetMapping("/trainer/{id}")
    public ResponseEntity<List<Rating>> getTrainerRatings(@PathVariable Long id) {
        Trainer trainer = trainerRepository.findById(id).orElseThrow();
        return ResponseEntity.ok(ratingRepository.findByTrainer(trainer));
    }
}
