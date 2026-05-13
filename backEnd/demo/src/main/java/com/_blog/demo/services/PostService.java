package com._blog.demo.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.post.PostRequestDTO;
import com._blog.demo.dto.post.PostResponseDTO;
import com._blog.demo.dto.post.PostUpdatReqDTO;
import com._blog.demo.entities.Post;
import com._blog.demo.entities.User;
import com._blog.demo.exceptions.ApiException;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.commentRepository;
import com._blog.demo.repositories.likeRepository;
import com._blog.demo.repositories.postRepository;

@Service
public class PostService {

    @Autowired
    private postRepository postRepository;

    @Autowired
    private likeRepository likeRepository;
    @Autowired
    private UserRepository UserRepository;

    @Autowired
    private commentRepository commentRepository;

    public PostResponseDTO createPost(PostRequestDTO request, String author) {

        User auth = UserRepository.findByUsername(author).orElseThrow(() -> ApiException.notFound("User not found"));

        Post newPost = new Post();
        newPost.setTitle(request.title());
        newPost.setContent(request.content());
        newPost.setStatus(true);
        newPost.setUser(auth);
        newPost.setTimestamp(new Date());
        Post savedPost = postRepository.save(newPost);

        PostResponseDTO postDto = new PostResponseDTO(
                savedPost.getId(),
                savedPost.getTitle(),
                savedPost.getContent(),

                savedPost.getUser() != null ? savedPost.getUser().getUsername() : "Unknown",
                savedPost.getTimestamp() != null ? savedPost.getTimestamp().toString() : null,
                likeRepository.existsByUserAndPost(auth, savedPost),
                savedPost.isStatus(),
                commentRepository.countByPost(savedPost),
                likeRepository.countByPost(savedPost));
        return postDto;
    }

    public Page<PostResponseDTO> getAllPosts(int page, int size, String username) {
        User auth = UserRepository.findByUsername(username).orElseThrow(() -> ApiException.notFound("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Post> postPage = postRepository.findFeedForUser(username, pageable);

        return postPage.map(p -> {
            PostResponseDTO postDto = new PostResponseDTO(
                    p.getId(),
                    p.getTitle(),
                    p.getContent(),
                    p.getUser() != null ? p.getUser().getUsername() : "Unknown",
                    p.getTimestamp() != null ? p.getTimestamp().toString() : null,
                    likeRepository.existsByUserAndPost(auth, p),
                    p.isStatus(),
                    commentRepository.countByPost(p),
                    likeRepository.countByPost(p));
            return postDto;
        });
    }

    public PostResponseDTO updatePost(PostUpdatReqDTO request, String author) {
        User auth = UserRepository.findByUsername(author).orElseThrow(() -> ApiException.notFound("User not found"));
        Post existingPost = postRepository.findById(request.getId())
                .orElseThrow(() -> ApiException.notFound("Post not found"));

        if (!existingPost.isStatus()) {
            throw ApiException.forbidden("this post is hidden, you can't do anything");
        }
        if (!existingPost.getUser().getId().equals(auth.getId())) {
            throw ApiException.forbidden("You are not authorized to update this post");
        }

        existingPost.setTitle(request.getTitle());
        existingPost.setContent(request.getContent());
        postRepository.save(existingPost);
        PostResponseDTO updatedPost = new PostResponseDTO(
                existingPost.getId(),
                existingPost.getTitle(),
                existingPost.getContent(),
                existingPost.getUser() != null ? existingPost.getUser().getUsername() : "Unknown",
                existingPost.getTimestamp() != null ? existingPost.getTimestamp().toString() : null,
                likeRepository.existsByUserAndPost(auth, existingPost),
                existingPost.isStatus(),
                commentRepository.countByPost(existingPost),
                likeRepository.countByPost(existingPost));
        return updatedPost;
    }

    public String deletePost(Long id, String author) {
        User auth = UserRepository.findByUsername(author).orElseThrow(() -> ApiException.notFound("User not found"));
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Post not found"));

        if (!existingPost.isStatus()) {
            throw ApiException.forbidden("this post is hidden, you can't do anything");
        }
        if (!existingPost.getUser().getId().equals(auth.getId()) && !auth.getRole().equals("ROLE_ADMIN")) {
            throw ApiException.forbidden("You are not authorized to delete this post");
        }

        postRepository.delete(existingPost);
        return "Post deleted successfully!";
    }

    public PostResponseDTO findPostById(Long id, String username) {
        User auth = UserRepository.findByUsername(username).orElseThrow(() -> ApiException.notFound("User not found"));
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Post not found"));

        if (!existingPost.isStatus()) {
            throw ApiException.forbidden("this post is hidden, you can't do anything");
        }

        PostResponseDTO response = new PostResponseDTO(
                existingPost.getId(),
                existingPost.getTitle(),
                existingPost.getContent(),
                existingPost.getUser() != null ? existingPost.getUser().getUsername()
                        : "Unknown",
                existingPost.getTimestamp() != null ? existingPost.getTimestamp().toString() : null,
                likeRepository.existsByUserAndPost(auth, existingPost),
                existingPost.isStatus(),
                commentRepository.countByPost(existingPost),
                likeRepository.countByPost(existingPost));
        return response;
    }

    public Page<PostResponseDTO> getAllPostsByOwner(int page, int size, String username, String currentUsername) {

        // 1. We only really need the CurrentUser to check for likes later
        User currentUser = UserRepository.findByUsername(currentUsername)
                .orElseThrow(() -> ApiException.notFound("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Post> postPage;

        if (username.equals(currentUsername)) {
            postPage = postRepository.findByUserUsername(username, pageable);
        } else {
            postPage = postRepository.findByUserUsernameAndStatusTrue(username, pageable);
        }

        return postPage.map(p -> new PostResponseDTO(
                p.getId(),
                p.getTitle(),
                p.getContent(),
                p.getUser() != null ? p.getUser().getUsername() : "Unknown",
                p.getTimestamp() != null ? p.getTimestamp().toString() : null,
                likeRepository.existsByUserAndPost(currentUser, p),
                p.isStatus(),
                commentRepository.countByPost(p),
                likeRepository.countByPost(p)));
    }
}
