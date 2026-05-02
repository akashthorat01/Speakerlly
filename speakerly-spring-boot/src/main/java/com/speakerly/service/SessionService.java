package com.speakerly.service;

import com.speakerly.entity.*;
import com.speakerly.repository.BookingRepository;
import com.speakerly.repository.SessionRepository;
import io.agora.media.RtcTokenBuilder2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SessionService {

    @Value("${agora.app.id}")
    private String appId;

    @Value("${agora.app.certificate}")
    private String appCertificate;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EarningsService earningsService;

    public Map<String, Object> startSession(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();

        if (booking.getStatus() != BookingStatus.CONFIRMED || !booking.getSlotDate().equals(LocalDate.now())) {
            throw new RuntimeException("Booking is not valid for starting a session today");
        }

        Session session = new Session();
        session.setBooking(booking);
        session.setUser(booking.getUser());
        session.setTrainer(booking.getTrainer());
        session.setSessionDate(LocalDate.now());
        session.setStartTime(LocalTime.now());
        session.setCallType(booking.getUser().getPlanType() == PlanType.PRO ? CallType.VIDEO : CallType.AUDIO);
        
        Session savedSession = sessionRepository.save(session);
        String channelName = "speakerly_" + savedSession.getSessionId();
        savedSession.setAgoraChannel(channelName);
        sessionRepository.save(savedSession);

        RtcTokenBuilder2 tokenBuilder = new RtcTokenBuilder2();
        int timestamp = (int) (System.currentTimeMillis() / 1000 + 3600); // 1 hour
        
        String token = tokenBuilder.buildTokenWithUid(
                appId, appCertificate, channelName, userId.intValue(), 
                RtcTokenBuilder2.Role.ROLE_PUBLISHER, timestamp, timestamp
        );

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("channelName", channelName);
        response.put("appId", appId);
        response.put("sessionId", savedSession.getSessionId());

        return response;
    }

    public Session endSession(Long sessionId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow();
        session.setEndTime(LocalTime.now());
        
        long durationMillis = java.time.Duration.between(session.getStartTime(), session.getEndTime()).toMillis();
        session.setDurationMins((int) (durationMillis / 60000));
        session.setStatus(SessionStatus.COMPLETED);
        
        Session completedSession = sessionRepository.save(session);
        
        earningsService.calculateEarnings(completedSession);
        
        return completedSession;
    }

    public List<Session> getUserHistory(User user) {
        return sessionRepository.findByUserOrderBySessionDateDesc(user);
    }
}
