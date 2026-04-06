package com._blog.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // The DTO we talked about!

import com._blog.demo.dto.RegisterRequestDTO;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // This is the "Brain" logic for registering a user
    public String registerNewUser(RegisterRequestDTO request) {
        
        // 1. Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }

        // 2. Convert the DTO into a real Entity so the DB can save it
        user newUser = new user();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        
        // (Later, you will encrypt the password here using BCrypt!)
        newUser.setPassword(request.getPassword()); 
        
        newUser.setRole("USER"); // Give them a default role
        newUser.setStatus(true); // Account is active

        // 3. Save to database using the Repository
        userRepository.save(newUser);

        return "User registered successfully!";
    }
}