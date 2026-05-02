package com.speakerly.repository;

import com.speakerly.entity.Notification;
import com.speakerly.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdAndUserTypeOrderByCreatedAtDesc(Long userId, Role userType);
}
