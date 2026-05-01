package com._blog.demo.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.comment.CommentRequestDTO;
import com._blog.demo.dto.comment.CommentResponseDTO;
import com._blog.demo.services.CommentService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/comment") // The base URL for all comment stuff
public class CommentController {

    @Autowired
    private CommentService CommentService;  

    @PostMapping("/create")
    public ResponseEntity<CommentResponseDTO> postMethodName(@Valid @RequestBody CommentRequestDTO request, Principal principal) {
        String username = principal.getName();
        CommentResponseDTO commentResponse = CommentService.createComment(request, username);
        return ResponseEntity.ok(commentResponse);
    }


    @GetMapping("/{postId}/list")
    public ResponseEntity<Page<CommentResponseDTO>> getMethodName(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size, @PathVariable Long postId) {
      
     Page<CommentResponseDTO> commentsPage = CommentService.getComments(page, size, postId);
        return ResponseEntity.ok(commentsPage);
    }
    

}
