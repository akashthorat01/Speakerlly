package com.speakerly.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

@Entity
@Table(name = "availability")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Availability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long availId;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @Column(nullable = false)
    private String dayOfWeek;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    private Boolean isAvailable = true;
}
