package com.speakerly.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @Column(nullable = false)
    private LocalDate sessionDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private Integer durationMins = 0;

    @Enumerated(EnumType.STRING)
    private SessionStatus status = SessionStatus.COMPLETED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CallType callType;

    private String agoraChannel;
}
