package com._blog.demo.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.post.PostRequestDTO;
import com._blog.demo.dto.post.ResponePost;
import com._blog.demo.services.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/post") // The base URL for all user stuff

class PostController {

    @PostMapping("/create")
    public ResponseEntity<String> createPost(@Valid @ModelAttribute PostRequestDTO request, Principal principal) {
        String username = principal.getName(); // Get the username of the logged-in user
        // This is a placeholder. You need to implement this method to get the actual logged-in user's ID.
        String result = PostService.createPost(request, username);

        return ResponseEntity.ok(result);
    }

    @Autowired
    private PostService PostService;

    @GetMapping("/getAll")
    public List<ResponePost> getPosts() {
        return PostService.findAllPosts();

    }

}
