package com._blog.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service; // The DTO we talked about!

import com._blog.demo.dto.RegisterRequestDTO;
import com._blog.demo.dto.userDTO;
import com._blog.demo.entities.User;
import com._blog.demo.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    public List<userDTO> findAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(user -> {
            userDTO dto = new userDTO();
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setBirthDate(user.getBirthDate());
            dto.setProfilePictureUrl(user.getProfilePictureUrl());
            return dto;
        }).toList();
    }

    public String registerNewUser(RegisterRequestDTO request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use!");
        }

        User newUser = new User();
        try {
            newUser.setUsername(request.getUsername());
            newUser.setEmail(request.getEmail());
            newUser.setFirstName(request.getFirstName());
            newUser.setLastName(request.getLastName());
            newUser.setBirthDate(request.getBirthDate());
            newUser.setPassword(passwordEncoder.encode(request.getPassword()));
            newUser.setBirthDate(request.getBirthDate());
        } catch (Exception e) {
            throw new RuntimeException("all fields are required!");
        }
        newUser.setProfilePictureUrl(request.getProfilePictureUrl());
        newUser.setRole("USER");
        newUser.setStatus(true);
        userRepository.save(newUser);
        return "User registered successfully!";
    }

    public userDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        userDTO dto = new userDTO();
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setBirthDate(user.getBirthDate());
        dto.setPosts(user.getPosts().size());
        dto.setFollowers(user.getFollowers().size());
        dto.setFollowing(user.getFollowing().size());
        dto.setNotifications(user.getReceivedNotifications().size());
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        return dto;
    }

    public List<userDTO> getSuggestions(String username) {
        List<User> suggestedUsers = userRepository.findRandomUsers(
                userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found with username: " + username))
                        .getId());
        return suggestedUsers.stream().map(user -> {
            userDTO dto = new userDTO();
            dto.setId(user.getId());
            dto.setUsername(user.getUsername());
            dto.setEmail(user.getEmail());
            dto.setFirstName(user.getFirstName());
            dto.setLastName(user.getLastName());
            dto.setBirthDate(user.getBirthDate());
            dto.setProfilePictureUrl(user.getProfilePictureUrl());
            dto.setFollowingBYMe(user.getFollowers().stream().anyMatch(follower -> follower.getId().equals(
                    userRepository.findByUsername(username)
                            .orElseThrow(() -> new RuntimeException("User not found with username: " + username))
                            .getId())));
            return dto;
        }).toList();

    }

}
