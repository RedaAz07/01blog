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

        user auth = UserRepository.findByUsername(author).orElseThrow(() -> new RuntimeException("User not found"));

        post newPost = new post();
        newPost.setTitle(request.title());
        newPost.setContent(request.content());
        newPost.setStatus(true);
        newPost.setUser(auth);
        newPost.setTimestamp(new Date());
        if (request.mediaFile() != null && !request.mediaFile().isEmpty()) {
        }

        post savedPost = postRepository.save(newPost);

        PostResponseDTO postDto = new PostResponseDTO(
                savedPost.getId(),
                savedPost.getTitle(),
                savedPost.getContent(),
            
                savedPost.getUser() != null ? savedPost.getUser().getUsername() : "Unknown",
                savedPost.getTimestamp() != null ? savedPost.getTimestamp().toString() : null,
                likeRepository.existsByUserAndPost(auth, savedPost),
                commentRepository.countByPost(savedPost),
                likeRepository.countByPost(savedPost)
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
       
                    p.getUser() != null ? p.getUser().getUsername() : "Unknown",
                    p.getTimestamp() != null ? p.getTimestamp().toString() : null,
                    likeRepository.existsByUserAndPost(auth, p),
                    commentRepository.countByPost(p),
                    likeRepository.countByPost(p)
            );
            return postDto;
        });
    }

    public PostResponseDTO updatePost(PostUpdatReqDTO request, String author) {
        user auth = UserRepository.findByUsername(author).orElseThrow(() -> new RuntimeException("User not found"));
        post existingPost = postRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!existingPost.getUser().getId().equals(auth.getId())) {
            throw new RuntimeException("You are not authorized to update this post");
        }

        existingPost.setTitle(request.getTitle());
        existingPost.setContent(request.getContent());

        if (request.getMediaFile() != null && !request.getMediaFile().isEmpty()) {
        }

        postRepository.save(existingPost);
        PostResponseDTO updatedPost = new PostResponseDTO(
                existingPost.getId(),
                existingPost.getTitle(),
                existingPost.getContent(),
     
                existingPost.getUser() != null ? existingPost.getUser().getUsername() : "Unknown",
                existingPost.getTimestamp() != null ? existingPost.getTimestamp().toString() : null,
                likeRepository.existsByUserAndPost(auth, existingPost),
                commentRepository.countByPost(existingPost),
                likeRepository.countByPost(existingPost)
        );
        return updatedPost;
    }

    public String deletePost(PostDeleteReqDTO request, String author) {
        user auth = UserRepository.findByUsername(author).orElseThrow(() -> new RuntimeException("User not found"));
        post existingPost = postRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
        System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><" + auth.getRole());
        if (!existingPost.getUser().getId().equals(auth.getId()) && !auth.getRole().equals("ROLE_ADMIN")) {
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
                existingPost.getUser() != null ? existingPost.getUser().getUsername()
                : "Unknown",
                existingPost.getTimestamp() != null ? existingPost.getTimestamp().toString() : null,
                likeRepository.existsByUserAndPost(auth, existingPost),
                commentRepository.countByPost(existingPost),
                likeRepository.countByPost(existingPost)
        );
        return response;
    }
}
