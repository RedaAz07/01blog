package com._blog.demo.controllers.post;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import jakarta.validation.Valid;

class creaetePost {

    @PostMapping("/create")
    public ResponseEntity<String> createPost(@Valid @ModelAttribute PostRequestDTO   request) {
        // Notice @ModelAttribute instead of @RequestBody!

        // Your logic to save the post and file...
        return ResponseEntity.ok("Post created successfully!");
    }
}
