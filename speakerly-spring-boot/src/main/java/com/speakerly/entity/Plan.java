package com.speakerly.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long planId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanType planName;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer durationDays;

    @Column(nullable = false)
    private Integer dailyHours;

    @Column(nullable = false)
    private Integer maxTrainers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CallType callType;
}
