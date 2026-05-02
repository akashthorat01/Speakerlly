package com.speakerly.controller;

import com.speakerly.dto.BookingRequest;
import com.speakerly.entity.Booking;
import com.speakerly.entity.BookingStatus;
import com.speakerly.security.CustomUserDetails;
import com.speakerly.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(Authentication auth, @RequestBody BookingRequest request) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(bookingService.createBooking(userDetails.getId(), request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getUserBookings(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(bookingService.getUserBookings(userDetails.getId()));
    }

    @GetMapping("/trainer")
    public ResponseEntity<List<Booking>> getTrainerBookings(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return ResponseEntity.ok(bookingService.getTrainerBookings(userDetails.getId()));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Booking> acceptBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, BookingStatus.CONFIRMED));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Booking> rejectBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, BookingStatus.REJECTED));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Booking> rescheduleBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, BookingStatus.RESCHEDULED));
    }
}
