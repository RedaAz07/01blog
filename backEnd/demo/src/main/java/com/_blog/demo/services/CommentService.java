package com._blog.demo.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.comment.CommentRequestDTO;
import com._blog.demo.dto.comment.CommentResponseDTO;
import com._blog.demo.entities.Comment;
import com._blog.demo.entities.Post;
import com._blog.demo.entities.User;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.commentRepository;
import com._blog.demo.repositories.postRepository;

@Service
public class CommentService {

    @Autowired
    private UserRepository UserRepository;
    @Autowired
    private postRepository postRepository;
    @Autowired
    private commentRepository commentRepository;

    public CommentResponseDTO createComment(CommentRequestDTO request, String username) {
        User auth = UserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(request.getPostId()).orElseThrow(() -> new RuntimeException("Post not found"));
        Comment newComment = new Comment();
        newComment.setContent(request.getContent());
        newComment.setUser(auth);
        newComment.setPost(post);
        newComment.setTimestamp(new Date());
        Comment savedComment = commentRepository.save(newComment);
        CommentResponseDTO response = new CommentResponseDTO();
        response.setId(savedComment.getId());
        response.setTimestamp(savedComment.getTimestamp());
        response.setContent(savedComment.getContent());
        response.setAuthorUsername(savedComment.getUser().getUsername());
        return response;
    }
    
}
