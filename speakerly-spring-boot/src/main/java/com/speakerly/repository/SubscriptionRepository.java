package com.speakerly.repository;

import com.speakerly.entity.Subscription;
import com.speakerly.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUser(User user);
    Optional<Subscription> findByUserAndIsActiveTrue(User user);
}
