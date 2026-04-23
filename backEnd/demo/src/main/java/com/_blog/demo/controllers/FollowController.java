package com._blog.demo.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.Response;
import com._blog.demo.dto.follow.FollowResponseDTO;
import com._blog.demo.services.FollowService;


@RestController
@RequestMapping("/api/users") 
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/follow/{targetUsername}")
    public ResponseEntity<Response> followUser(@PathVariable String targetUsername, Principal principal) {
        String myUsername = principal.getName();    
        
        String response = followService.toggleFollow(myUsername, targetUsername);
        
        return ResponseEntity.ok(new Response(response));
    }

    @GetMapping("/following/{username}")
    public ResponseEntity<List<FollowResponseDTO>> getFollowing(@PathVariable String username, Principal principal) {
String myUsername = principal.getName();
        List<FollowResponseDTO> following = followService.getFollowing(username , myUsername);
        return ResponseEntity.ok(following);
    }
      @GetMapping("/followers/{username}")
    public ResponseEntity<List<FollowResponseDTO>> getFollowers(@PathVariable String username, Principal principal) {
        String myUsername = principal.getName();
        List<FollowResponseDTO> followers = followService.getFollowers(username , myUsername);
        return ResponseEntity.ok(followers);
    }
    
}