package com.speakerly.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "penalties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Penalty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long penaltyId;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @OneToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    private String reason;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
