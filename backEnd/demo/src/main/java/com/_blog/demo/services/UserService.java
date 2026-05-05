package com._blog.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.RegisterRequestDTO;
import com._blog.demo.dto.auth.EditProfileRequestDTO;
import com._blog.demo.dto.userDTO; // The DTO we talked about!
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
        newUser.setBio(request.getBio());
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

    public userDTO getUserByUsername(String username, String currentUsername) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        userDTO dto = new userDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setBirthDate(user.getBirthDate());

        dto.setPosts(user.getPosts().size());
        dto.setFollowers(user.getFollowers().size());
        dto.setFollowing(user.getFollowing().size());
        dto.setBio(user.getBio());
        dto.setStatus(user.isStatus());
        dto.setFollowingBYMe(user.getFollowers().stream().anyMatch(follower -> follower.getId().equals(
                userRepository.findByUsername(currentUsername)
                        .orElseThrow(() -> new RuntimeException("User not found with username: " + currentUsername))
                        .getId())));
        dto.setProfilePictureUrl(user.getProfilePictureUrl());
        return dto;
    }

    public userDTO editProfile(String username, EditProfileRequestDTO request, String currentUsername) {
        if (username.equals("admin")) {
            throw new RuntimeException("as an Admin you can't edit  the username ");
        }
        if (!username.equals(currentUsername)) {
            throw new RuntimeException("You can only edit your own profile!");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username is already taken!");
            }
            user.setUsername(request.getUsername());
        }
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email is already in use!");
            }
            user.setEmail(request.getEmail());
        }
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setBio(request.getBio());
        userRepository.save(user);
        return getUserByUsername(username, currentUsername);
    }
}
