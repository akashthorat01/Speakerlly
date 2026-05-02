package com.speakerly.repository;

import com.speakerly.entity.Plan;
import com.speakerly.entity.PlanType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    Optional<Plan> findByPlanName(PlanType planName);
}
