package com.speakerly.repository;

import com.speakerly.entity.Earnings;
import com.speakerly.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EarningsRepository extends JpaRepository<Earnings, Long> {
    List<Earnings> findByTrainer(Trainer trainer);
}
