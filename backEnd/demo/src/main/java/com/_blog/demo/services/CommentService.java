package com._blog.demo.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.Response;
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
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));
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

    public Page<CommentResponseDTO> getComments(int page, int size, Long postId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Comment> commentsPage = commentRepository.findByPostId(postId, pageable);
        return commentsPage.map(comment -> {
            CommentResponseDTO dto = new CommentResponseDTO();
            dto.setId(comment.getId());
            dto.setContent(comment.getContent());
            dto.setAuthorUsername(comment.getUser().getUsername());
            dto.setTimestamp(comment.getTimestamp());
            return dto;
        });
    }
    

    public ResponseEntity<Response> deleteComment(Long commentId, String username) {
        User auth = UserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUser().getId().equals(auth.getId())) {
            return ResponseEntity.status(403).body(new Response("You can only delete your own comments"));
        }
        commentRepository.delete(comment);
        return ResponseEntity.ok(new Response("Comment deleted successfully"));
    }

}
