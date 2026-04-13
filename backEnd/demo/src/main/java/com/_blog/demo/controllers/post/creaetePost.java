package com._blog.demo.controllers.post;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.post.PostRequestDTO;

import jakarta.validation.Valid;
@RestController
@RequestMapping("/api") // The base URL for all user stuff

class creaetePost {

    @PostMapping("/create")
    public ResponseEntity<String> createPost(@Valid @ModelAttribute PostRequestDTO   request) {
      
        return ResponseEntity.ok("Post created successfully!");
    }
}
