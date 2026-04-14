package com._blog.demo.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.post.PostDeleteReqDTO;
import com._blog.demo.dto.post.PostRequestDTO;
import com._blog.demo.dto.post.PostResponseDTO;
import com._blog.demo.dto.post.PostUpdatReqDTO;
import com._blog.demo.services.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/post") // The base URL for all user stuff

class PostController {

    @PostMapping("/create")
    public ResponseEntity<String> createPost(@Valid @ModelAttribute PostRequestDTO request, Principal principal) {
        String username = principal.getName(); 
        String result = PostService.createPost(request, username);

        return ResponseEntity.ok(result);
    }

    @Autowired
    private PostService PostService;

    @GetMapping("/getAll")
    public List<PostResponseDTO> getPosts() {
        return PostService.findAllPosts();

    }

    @PutMapping("/update")
    public ResponseEntity<PostResponseDTO> postMethodName(@Valid @ModelAttribute PostUpdatReqDTO request, Principal principal) {
        String username = principal.getName();
        PostResponseDTO post = PostService.updatePost(request, username);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deletePost(@Valid @ModelAttribute PostDeleteReqDTO request, Principal principal) {
        String username = principal.getName();
        String result = PostService.deletePost(request, username);
        return ResponseEntity.ok(result);
    }
}
