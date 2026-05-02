package com.speakerly.security;

import com.speakerly.entity.Trainer;
import com.speakerly.entity.User;
import com.speakerly.repository.TrainerRepository;
import com.speakerly.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByEmail(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return new CustomUserDetails(user.getUserId(), user.getEmail(), user.getPasswordHash(), user.getRole().name());
        }

        Optional<Trainer> trainerOptional = trainerRepository.findByEmail(username);
        if (trainerOptional.isPresent()) {
            Trainer trainer = trainerOptional.get();
            return new CustomUserDetails(trainer.getTrainerId(), trainer.getEmail(), trainer.getPasswordHash(), "TRAINER");
        }

        throw new UsernameNotFoundException("User not found with email: " + username);
    }
}
