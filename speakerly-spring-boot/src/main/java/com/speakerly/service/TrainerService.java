package com.speakerly.service;

import com.speakerly.entity.Availability;
import com.speakerly.entity.Trainer;
import com.speakerly.repository.AvailabilityRepository;
import com.speakerly.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    public List<Trainer> getApprovedTrainers() {
        return trainerRepository.findByIsApproved(true);
    }

    public Trainer getTrainer(Long id) {
        return trainerRepository.findById(id).orElseThrow(() -> new RuntimeException("Trainer not found"));
    }

    public List<Availability> getTrainerSlots(Long trainerId) {
        Trainer trainer = getTrainer(trainerId);
        return availabilityRepository.findByTrainer(trainer);
    }

    public Trainer updateProfile(Long id, Trainer updateDetails) {
        Trainer trainer = getTrainer(id);
        trainer.setBio(updateDetails.getBio());
        trainer.setSpecialisation(updateDetails.getSpecialisation());
        trainer.setPhone(updateDetails.getPhone());
        trainer.setDemoVideoUrl(updateDetails.getDemoVideoUrl());
        return trainerRepository.save(trainer);
    }

    public List<Availability> setAvailability(Long trainerId, List<Availability> availabilities) {
        Trainer trainer = getTrainer(trainerId);
        
        // Remove old availability
        List<Availability> oldAvailabilities = availabilityRepository.findByTrainer(trainer);
        availabilityRepository.deleteAll(oldAvailabilities);

        // Set new availability
        for (Availability av : availabilities) {
            av.setTrainer(trainer);
        }
        return availabilityRepository.saveAll(availabilities);
    }
}
