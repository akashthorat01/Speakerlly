package com.speakerly.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ratings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer;

    @OneToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    private Integer stars;

    @Column(columnDefinition = "TEXT")
    private String review;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
