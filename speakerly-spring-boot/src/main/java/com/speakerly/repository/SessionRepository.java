package com.speakerly.repository;

import com.speakerly.entity.Session;
import com.speakerly.entity.Trainer;
import com.speakerly.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByUser(User user);
    List<Session> findByTrainer(Trainer trainer);
    List<Session> findByUserOrderBySessionDateDesc(User user);
}
