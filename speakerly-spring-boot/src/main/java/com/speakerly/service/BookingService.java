package com.speakerly.service;

import com.speakerly.dto.BookingRequest;
import com.speakerly.entity.*;
import com.speakerly.repository.BookingRepository;
import com.speakerly.repository.TrainerRepository;
import com.speakerly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    public Booking createBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId).orElseThrow();
        Trainer trainer = trainerRepository.findById(request.getTrainerId()).orElseThrow();

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTrainer(trainer);
        booking.setSlotDate(request.getSlotDate());
        booking.setSlotTime(request.getSlotTime());
        booking.setStatus(BookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return bookingRepository.findByUser(user);
    }

    public List<Booking> getTrainerBookings(Long trainerId) {
        Trainer trainer = trainerRepository.findById(trainerId).orElseThrow();
        return bookingRepository.findByTrainerOrderBySlotDateAscSlotTimeAsc(trainer);
    }

    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}
