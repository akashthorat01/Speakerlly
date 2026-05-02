package com.speakerly.repository;

import com.speakerly.entity.Availability;
import com.speakerly.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByTrainer(Trainer trainer);
}
