package com._blog.demo.services;

import org.springframework.beans.factory.annotation.Autowired;

import com._blog.demo.dto.post.PostRequestDTO;
import com._blog.demo.entities.post;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.postRepository;

public class PostService {

    @Autowired
    private postRepository postRepository;

    public String createPost(PostRequestDTO request, user author) {

        post newPost = new post();
        newPost.setTitle(request.getTitle());
        newPost.setContent(request.getContent());

        // 1. Check if they actually uploaded a file
        if (request.getMediaFile() != null && !request.getMediaFile().isEmpty()) {

            // 2. Call a helper method to save the file to your computer/server
            // (This method takes the MultipartFile and returns the String URL)
            FileStorageService fileStorageService = new FileStorageService();
            String savedFileUrl = fileStorageService.saveFile(request.getMediaFile());
            // 3. Put the String URL into the Entity!
            newPost.setMedia(savedFileUrl);
        }

        newPost.setUser_id(author);
        postRepository.save(newPost);
        return "Post created successfully!";
    }
}
