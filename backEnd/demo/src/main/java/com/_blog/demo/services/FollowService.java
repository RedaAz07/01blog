package com._blog.demo.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com._blog.demo.dto.follow.FollowResponseDTO;
import com._blog.demo.dto.follow.ToggleFollowDTO;
import com._blog.demo.entities.User;
import com._blog.demo.exceptions.ApiException;
import com._blog.demo.repositories.UserRepository;

@Service
public class FollowService {

    private final UserRepository userRepository;

    public FollowService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public ToggleFollowDTO toggleFollow(String myUsername, String targetUsername) {

        if (myUsername.equals(targetUsername)) {
            throw ApiException.badRequest("You cannot follow yourself.");
        }

        User me = userRepository.findByUsername(myUsername)
                .orElseThrow(() -> ApiException.notFound("Your user not found"));

        User targetUser = userRepository.findByUsername(targetUsername)
                .orElseThrow(() -> ApiException.notFound("Target user not found"));

        if (me.getFollowing().contains(targetUser)) {
            me.getFollowing().remove(targetUser);
            targetUser.getFollowers().remove(me);
            userRepository.save(me);
            return new ToggleFollowDTO(false, targetUser.getFollowers().size());
        } else {
            me.getFollowing().add(targetUser);
            targetUser.getFollowers().add(me);
            userRepository.save(me);
            return new ToggleFollowDTO(true, targetUser.getFollowers().size());
        }
    }

    public List<FollowResponseDTO> getFollowing(String username, String myUsername) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> ApiException.notFound("User not found"));
      

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
                .orElseThrow(() -> ApiException.notFound("User not found"));
      
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
