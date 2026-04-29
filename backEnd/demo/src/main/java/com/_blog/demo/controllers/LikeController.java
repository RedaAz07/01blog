package com._blog.demo.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.services.LikeService;


@RestController
@RequestMapping("/api/likes") // The base URL for all like stuff
public class LikeController {

    @Autowired
    private LikeService LikeService;

  @PostMapping("/{postId}/like")
    public ResponseEntity<Integer> toggleLike(@PathVariable Long postId, Principal principal) {
        
        String username = principal.getName();
        
        // 3. The service should handle the logic and return the total like count
        int newLikeCount = LikeService.likeReq(postId, username);
        
        return ResponseEntity.ok(newLikeCount);
    }
  
    

}
