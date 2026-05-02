package com.speakerly.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class BookingRequest {
    private Long trainerId;
    private LocalDate slotDate;
    private LocalTime slotTime;
}
