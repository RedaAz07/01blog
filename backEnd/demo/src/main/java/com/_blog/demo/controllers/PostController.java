package com._blog.demo.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.Response;
import com._blog.demo.dto.post.PostRequestDTO;
import com._blog.demo.dto.post.PostResponseDTO;
import com._blog.demo.dto.post.PostUpdatReqDTO;
import com._blog.demo.services.NotificationService;
import com._blog.demo.services.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/post") // The base URL for all user stuff

class PostController {

    @Autowired
    private NotificationService NotificationService;

    @PostMapping("/create")
    public ResponseEntity<PostResponseDTO> createPost(@Valid @RequestBody PostRequestDTO request, Principal principal) {
        String username = principal.getName();
        PostResponseDTO result = PostService.createPost(request, username);

        NotificationService.createNotification(username, result);
        return ResponseEntity.ok(result);
    }

    @Autowired
    private PostService PostService;

    @GetMapping("/all")
    public ResponseEntity<Page<PostResponseDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, Principal principal) {
        String username = principal.getName();
        Page<PostResponseDTO> posts = PostService.getAllPosts(page, size, username);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/update")
    public ResponseEntity<PostResponseDTO> postMethodName(@Valid @RequestBody PostUpdatReqDTO request,
            Principal principal) {
        String username = principal.getName();
        PostResponseDTO post = PostService.updatePost(request, username);
        return ResponseEntity.ok(post);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deletePost(@Valid @PathVariable Long id, Principal principal) {
        String username = principal.getName();
        String result = PostService.deletePost(id, username);
        return ResponseEntity.ok(new Response(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDTO> getMethodName(@PathVariable Long id, Principal principal) {
        String username = principal.getName();
        PostResponseDTO post = PostService.findPostById(id, username);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/owner/{username}")
    public ResponseEntity<Page<PostResponseDTO>> getAllPostsByOwner(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @PathVariable String username, Principal principal) {
        String CurrentUsername = principal.getName();
        Page<PostResponseDTO> posts = PostService.getAllPostsByOwner(page, size, username, CurrentUsername);
        return ResponseEntity.ok(posts);
    }

}
