package com.speakerly.service;

import com.speakerly.entity.Session;
import com.speakerly.entity.User;
import com.speakerly.repository.SessionRepository;
import com.speakerly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProgressService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getDailyProgress(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Session> sessions = sessionRepository.findByUser(user);

        int totalMinsToday = sessions.stream()
                .filter(s -> s.getSessionDate().equals(LocalDate.now()))
                .mapToInt(Session::getDurationMins)
                .sum();

        Map<String, Object> progress = new HashMap<>();
        progress.put("totalMinutesToday", totalMinsToday);
        progress.put("targetMinutes", 60); // Sample target
        return progress;
    }

    public Map<String, Object> getSummary(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Session> sessions = sessionRepository.findByUser(user);

        int totalMins = sessions.stream().mapToInt(Session::getDurationMins).sum();
        long totalSessions = sessions.size();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalMinutes", totalMins);
        summary.put("totalSessions", totalSessions);
        return summary;
    }
}
