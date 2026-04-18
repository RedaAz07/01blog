package com._blog.demo.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.post.PostDeleteReqDTO;
import com._blog.demo.dto.post.PostRequestDTO;
import com._blog.demo.dto.post.PostResponseDTO;
import com._blog.demo.dto.post.PostUpdatReqDTO;
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

    public PostResponseDTO createPost(PostRequestDTO request, String author) {

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

        post savedPost = postRepository.save(newPost);

        PostResponseDTO response = new PostResponseDTO();
        response.setId(savedPost.getId());
        response.setTitle(savedPost.getTitle());
        response.setContent(savedPost.getContent());
        response.setDescription(savedPost.getDescription());
        response.setMediaUrl(savedPost.getMedia());
        response.setTimestamp(savedPost.getTimestamp().toString());
        response.setAuthorUsername(savedPost.getUser_id().getUsername());
        return response;
    }

  public Page<PostResponseDTO> getAllPosts(int page, int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<post> postPage = postRepository.findAll(pageable);

        return postPage.map(p -> {
            PostResponseDTO dto = new PostResponseDTO();
            dto.setId(p.getId());
            dto.setTitle(p.getTitle());
            dto.setContent(p.getContent());
            dto.setDescription(p.getDescription());
            dto.setMediaUrl(p.getMedia());
            
            if (p.getUser_id() != null) {
                dto.setAuthorUsername(p.getUser_id().getUsername()); 
            }
            return dto;
        });
    }

    public PostResponseDTO updatePost(PostUpdatReqDTO request, String author) {
        user auth = UserRepository.findByUsername(author).orElseThrow(() -> new RuntimeException("User not found"));
        post existingPost = postRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!existingPost.getUser_id().getId().equals(auth.getId())) {
            throw new RuntimeException("You are not authorized to update this post");
        }

        existingPost.setTitle(request.getTitle());
        existingPost.setContent(request.getContent());
        existingPost.setDescription(request.getDescription());

        if (request.getMediaFile() != null && !request.getMediaFile().isEmpty()) {
            FileStorageService fileStorageService = new FileStorageService();
            String savedFileUrl = fileStorageService.saveFile(request.getMediaFile());
            existingPost.setMedia(savedFileUrl);
        }

        postRepository.save(existingPost);
        PostResponseDTO updatedPost = new PostResponseDTO();
        updatedPost.setId(existingPost.getId());
        updatedPost.setTitle(existingPost.getTitle());
        updatedPost.setContent(existingPost.getContent());
        updatedPost.setDescription(existingPost.getDescription());
        updatedPost.setMediaUrl(existingPost.getMedia());
        updatedPost.setTimestamp(existingPost.getTimestamp().toString());
        updatedPost.setAuthorUsername(existingPost.getUser_id().getUsername());
        return updatedPost;
    }

    public String deletePost(PostDeleteReqDTO request, String author) {
        user auth = UserRepository.findByUsername(author).orElseThrow(() -> new RuntimeException("User not found"));
        post existingPost = postRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!existingPost.getUser_id().getId().equals(auth.getId())) {
            throw new RuntimeException("You are not authorized to delete this post");
        }

        postRepository.delete(existingPost);
        return "Post deleted successfully!";
    }

    public PostResponseDTO findPostById(Long id) {
        post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        PostResponseDTO response = new PostResponseDTO();
        response.setId(existingPost.getId());
        response.setTitle(existingPost.getTitle());
        response.setContent(existingPost.getContent());
        response.setDescription(existingPost.getDescription());
        response.setMediaUrl(existingPost.getMedia());
        response.setTimestamp(existingPost.getTimestamp().toString());
        response.setAuthorUsername(existingPost.getUser_id().getUsername());
        return response;
    }
}
