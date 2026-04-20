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
        newPost.setTitle(request.title());
        newPost.setContent(request.content());
        newPost.setDescription(request.description());
        newPost.setStatus(true);
        newPost.setUser_id(auth);
        newPost.setTimestamp(new Date());
        if (request.mediaFile() != null && !request.mediaFile().isEmpty()) {
            FileStorageService fileStorageService = new FileStorageService();
            String savedFileUrl = fileStorageService.saveFile(request.mediaFile());
            newPost.setMedia(savedFileUrl);
        }

        post savedPost = postRepository.save(newPost);

        PostResponseDTO postDto = new PostResponseDTO(
                savedPost.getId(),
                savedPost.getTitle(),
                savedPost.getContent(),
                savedPost.getMedia(),
                savedPost.getDescription(),
                savedPost.getUser_id() != null ? savedPost.getUser_id().getUsername() : "Unknown",
                savedPost.getTimestamp() != null ? savedPost.getTimestamp().toString() : null,
                postRepository.likedByUserAndPost(auth, savedPost),
                postRepository.countCommentsByPost(savedPost),
                postRepository.countLikesByPost(savedPost)
        );
        return postDto;
    }

    public Page<PostResponseDTO> getAllPosts(int page, int size, String username) {
        user auth = UserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<post> postPage = postRepository.findAll(pageable);

        return postPage.map(p -> {
            PostResponseDTO postDto = new PostResponseDTO(
                    p.getId(),
                    p.getTitle(),
                    p.getContent(),
                    p.getMedia(),
                    p.getDescription(),
                    p.getUser_id() != null ? p.getUser_id().getUsername() : "Unknown",
                    p.getTimestamp() != null ? p.getTimestamp().toString() : null,
                    postRepository.likedByUserAndPost(auth, p),
                    postRepository.countCommentsByPost(p),
                    postRepository.countLikesByPost(p)
            );
            return postDto;
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
        PostResponseDTO updatedPost = new PostResponseDTO(
                existingPost.getId(),
                existingPost.getTitle(),
                existingPost.getContent(),
                existingPost.getMedia(),
                existingPost.getDescription(),
                existingPost.getUser_id() != null ? existingPost.getUser_id().getUsername() : "Unknown",
                existingPost.getTimestamp() != null ? existingPost.getTimestamp().toString() : null,
                postRepository.likedByUserAndPost(auth, existingPost),
                postRepository.countCommentsByPost(existingPost),
                postRepository.countLikesByPost(existingPost)
        );
        return updatedPost;
    }

    public String deletePost(PostDeleteReqDTO request, String author) {
        user auth = UserRepository.findByUsername(author).orElseThrow(() -> new RuntimeException("User not found"));
        post existingPost = postRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><" + auth.getRole());
        if (!existingPost.getUser_id().getId().equals(auth.getId()) && !auth.getRole().equals("ROLE_ADMIN")) {
            throw new RuntimeException("You are not authorized to delete this post");
        }

        postRepository.delete(existingPost);
        return "Post deleted successfully!";
    }

    public PostResponseDTO findPostById(Long id, String username) {
        user auth = UserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));  
        post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        PostResponseDTO response = new PostResponseDTO(
                existingPost.getId(),
                existingPost.getTitle(),
                existingPost.getContent(),
                existingPost.getMedia(),
                existingPost.getDescription(),
                existingPost.getUser_id() != null ? existingPost.getUser_id().getUsername()
                : "Unknown",
                existingPost.getTimestamp() != null ? existingPost.getTimestamp().toString() : null,
                postRepository.likedByUserAndPost(auth, existingPost),
                postRepository.countCommentsByPost(existingPost),
                postRepository.countLikesByPost(existingPost)
        );
        return response;
    }
}
