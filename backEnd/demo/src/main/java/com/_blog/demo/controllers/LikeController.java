package com._blog.demo.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.like.LikeRequestDTO;
import com._blog.demo.services.LikeService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/like") // The base URL for all like stuff
public class LikeController {

    @Autowired
    private LikeService LikeService;

    @PostMapping("/")
    public ResponseEntity<String> like(@Valid @RequestBody LikeRequestDTO likeRequest, Principal principal) {

        String username = principal.getName();
        String res = LikeService.likeReq(likeRequest, username);
        return ResponseEntity.ok(res);
    }
  
    

}
