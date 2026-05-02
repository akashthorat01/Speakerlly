package com.speakerly.service;

import com.speakerly.dto.AuthRequest;
import com.speakerly.dto.AuthResponse;
import com.speakerly.dto.RegisterRequest;
import com.speakerly.entity.Role;
import com.speakerly.entity.Trainer;
import com.speakerly.entity.User;
import com.speakerly.repository.TrainerRepository;
import com.speakerly.repository.UserRepository;
import com.speakerly.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse login(AuthRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String role = "USER";
        Long id = null;
        String name = null;

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            role = user.getRole().name();
            id = user.getUserId();
            name = user.getName();
        } else {
            Optional<Trainer> trainerOpt = trainerRepository.findByEmail(request.getEmail());
            if (trainerOpt.isPresent()) {
                Trainer trainer = trainerOpt.get();
                role = "TRAINER";
                id = trainer.getTrainerId();
                name = trainer.getName();
            }
        }

        String token = jwtUtil.generateToken(request.getEmail(), role);
        return new AuthResponse(token, role, id, name);
    }

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()) || trainerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        if ("trainer".equalsIgnoreCase(request.getRole())) {
            Trainer trainer = new Trainer();
            trainer.setName(request.getName());
            trainer.setEmail(request.getEmail());
            trainer.setPasswordHash(encodedPassword);
            trainerRepository.save(trainer);
        } else {
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPasswordHash(encodedPassword);
            user.setRole(Role.USER);
            userRepository.save(user);
        }
    }
}
