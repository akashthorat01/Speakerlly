package com.speakerly.repository;

import com.speakerly.entity.Rating;
import com.speakerly.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByTrainer(Trainer trainer);
}
