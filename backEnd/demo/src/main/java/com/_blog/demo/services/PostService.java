package com._blog.demo.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.post.PostRequestDTO;
import com._blog.demo.dto.post.ResponePost;
import com._blog.demo.entities.post;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.postRepository;

@Service
public class PostService {

    @Autowired
    private postRepository postRepository;

    @Autowired
    private UserRepository UserRepository;

    public String createPost(PostRequestDTO request, String author) {

        user auth = UserRepository.findByUsername(author).orElseThrow(() -> new RuntimeException("User not found"));

        post newPost = new post();
        newPost.setTitle(request.getTitle());
        newPost.setContent(request.getContent());
        newPost.setDescription(request.getDescription());
        newPost.setStatus(true);
        newPost.setUser_id(auth);
        newPost.setTimestamp(new Date());
        if (request.getMediaFile() != null && !request.getMediaFile().isEmpty()) {
            FileStorageService fileStorageService = new FileStorageService();
            String savedFileUrl = fileStorageService.saveFile(request.getMediaFile());
            newPost.setMedia(savedFileUrl);
        }

        postRepository.save(newPost);
        return "Post created successfully!";
    }

    public List<ResponePost> findAllPosts() {
        List<post> posts = postRepository.findAll();
        return posts.stream().map(post -> {
            ResponePost response = new ResponePost();
            response.setId(post.getId());
            response.setTitle(post.getTitle());
            response.setContent(post.getContent());
            response.setDescription(post.getDescription());
            response.setMediaUrl(post.getMedia());
            response.setAuthorUsername(post.getUser_id().getUsername());
            return response;
        }).toList();
    }
}
