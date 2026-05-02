package com.speakerly.repository;

import com.speakerly.entity.Booking;
import com.speakerly.entity.Trainer;
import com.speakerly.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    List<Booking> findByTrainer(Trainer trainer);
    List<Booking> findByTrainerOrderBySlotDateAscSlotTimeAsc(Trainer trainer);
}
