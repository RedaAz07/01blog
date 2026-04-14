package com._blog.demo.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import com._blog.demo.dto.comment.CommentRequestDTO;
import com._blog.demo.dto.comment.CommentResponseDTO;
import com._blog.demo.entities.comment;
import com._blog.demo.entities.post;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.postRepository;
@Service
public class CommentService {

    @Autowired
    private static UserRepository UserRepository;
    @Autowired
    private static postRepository postRepository;

    public CommentResponseDTO createComment(@RequestBody CommentRequestDTO request, String username) {
        user auth = UserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        post post = postRepository.findById(request.getPostId()).orElseThrow(() -> new RuntimeException("Post not found"));
        comment newComment = new comment();
        newComment.setContent(request.getContent());
        newComment.setUser_id(auth);
        newComment.setPost_id(post);
        newComment.setTimestamp(new Date());

        CommentResponseDTO response = new CommentResponseDTO();
        response.setId(request.getPostId());
        response.setContent(request.getContent());
        response.setAuthorUsername(username);
        return response;
    }
}
