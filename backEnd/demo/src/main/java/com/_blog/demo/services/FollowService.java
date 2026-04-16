package com._blog.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com._blog.demo.dto.follow.FollowResponseDTO;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;

@Service
public class FollowService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public String toggleFollow(String myUsername, String targetUsername) {

        if (myUsername.equals(targetUsername)) {
            throw new RuntimeException("Bro, you cannot follow yourself!");
        }

        user me = userRepository.findByUsername(myUsername)
                .orElseThrow(() -> new RuntimeException("Your user not found"));

        user targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (me.getFollowing().contains(targetUser)) {
            me.getFollowing().remove(targetUser);
            userRepository.save(me);
            return "You unfollowed " + targetUsername;
        } else {
            // FOLLOW: Add them to the list
            me.getFollowing().add(targetUser);
            userRepository.save(me);
            return "You are now following " + targetUsername;
        }
    }

    public List<FollowResponseDTO> getFollowing(String username) {
        user user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        

        List<user> following = user.getFollowing();
        return following.stream()
                .map(followedUser -> {
                    FollowResponseDTO dto = new FollowResponseDTO();
                    dto.setUsername(followedUser.getUsername());
                    dto.setProfilePictureUrl(followedUser.getProfilePictureUrl());
                    return dto;
                })
                .toList();
    }

    public List<FollowResponseDTO> getFollowers(String username) {
        user user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<user> followers = user.getFollowers();
        return followers.stream()
                .map(follower -> {
                    FollowResponseDTO dto = new FollowResponseDTO();
                    dto.setUsername(follower.getUsername());
                    dto.setProfilePictureUrl(follower.getProfilePictureUrl());
                    return dto;
                })
                .toList();

    }
}
