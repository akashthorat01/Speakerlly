package com.speakerly.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trainers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long trainerId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String phone;

    private String demoVideoUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String specialisation;

    @Column(precision = 3, scale = 2)
    private BigDecimal ratingAvg = BigDecimal.ZERO;

    private Boolean isApproved = false;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalEarnings = BigDecimal.ZERO;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
