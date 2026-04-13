package com._blog.demo.controllers.post;

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
import com._blog.demo.entities.user;
import com._blog.demo.services.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api") // The base URL for all user stuff

class creaetePost {

    @PostMapping("/create")
    public ResponseEntity<String> createPost(@Valid @ModelAttribute PostRequestDTO request) {

        Long authorId = user.getCurrentLoggedInUserId(); 
        // This is a placeholder. You need to implement this method to get the actual logged-in user's ID.
        String result = PostService.createPost(request, authorId);

        return ResponseEntity.ok("Post created successfully!");
    }

    @Autowired
    private PostService PostService;

    @GetMapping("/posts")
    public List<ResponePost> getPosts() {
        return PostService.findAllPosts();

    }

}
