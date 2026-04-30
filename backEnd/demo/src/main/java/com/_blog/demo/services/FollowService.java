package com._blog.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com._blog.demo.dto.follow.FollowResponseDTO;
import com._blog.demo.entities.User;
import com._blog.demo.repositories.UserRepository;

@Service
public class FollowService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public boolean toggleFollow(String myUsername, String targetUsername) {

        if (myUsername.equals(targetUsername)) {
            throw new RuntimeException("Bro, you cannot follow yourself!");
        }

        User me = userRepository.findByUsername(myUsername)
                .orElseThrow(() -> new RuntimeException("Your user not found"));

        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (me.getFollowing().contains(targetUser)) {
            me.getFollowing().remove(targetUser);
            userRepository.save(me);
            return false;
        } else {
            me.getFollowing().add(targetUser);
            userRepository.save(me);
            return true;
        }
    }

    public List<FollowResponseDTO> getFollowing(String username, String myUsername) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!username.equals(myUsername) || user.getFollowers().stream().anyMatch(follower -> follower.getUsername().equals(myUsername))) {
            throw new RuntimeException("You can only see the following list of users you follow");
        }

        List<User> following = user.getFollowing();
        return following.stream()
                .map(followedUser -> {
                    FollowResponseDTO dto = new FollowResponseDTO();
                    dto.setUsername(followedUser.getUsername());
                    dto.setProfilePictureUrl(followedUser.getProfilePictureUrl());
                    return dto;
                })
                .toList();
    }

    public List<FollowResponseDTO> getFollowers(String username, String myUsername) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!username.equals(myUsername) || user.getFollowers().stream().anyMatch(follower -> follower.getUsername().equals(myUsername))) {
            throw new RuntimeException("You can only see the followers list of users you follow");
        }
        List<User> followers = user.getFollowers();
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
