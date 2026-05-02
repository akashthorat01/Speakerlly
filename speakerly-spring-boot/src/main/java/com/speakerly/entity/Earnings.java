package com.speakerly.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "earnings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Earnings {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long earningId;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @OneToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal grossAmount;

    @Column(precision = 5, scale = 2)
    private BigDecimal commissionPercent = new BigDecimal("16.00");

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal commissionAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal netAmount;

    @Column(precision = 10, scale = 2)
    private BigDecimal penaltyDeduction = BigDecimal.ZERO;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
