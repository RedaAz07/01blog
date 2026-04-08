package com._blog.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service; // The DTO we talked about!

import com._blog.demo.dto.RegisterRequestDTO;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // <-- 1. Inject the encoder

    public String registerNewUser(RegisterRequestDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        user newUser = new user();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        // 🛑 ADD THESE THREE LINES!
        newUser.setFirstName(request.getFirstName());
        newUser.setLastName(request.getLastName());
        newUser.setBirthDate(request.getBirthDate());
        newUser.setProfilePictureUrl(request.getProfilePictureUrl());

        
        // 2. Scramble the password before saving!
        newUser.setPassword(passwordEncoder.encode(request.getPassword())); 
        
        newUser.setRole("USER"); 
        newUser.setStatus(true); 

        userRepository.save(newUser);
        return "User registered successfully!";
    }
}