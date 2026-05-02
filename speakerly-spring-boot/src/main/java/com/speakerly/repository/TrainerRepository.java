package com.speakerly.repository;

import com.speakerly.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    Optional<Trainer> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Trainer> findByIsApproved(Boolean isApproved);
}
