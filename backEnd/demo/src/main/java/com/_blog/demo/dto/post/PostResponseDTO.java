package com._blog.demo.dto.post;

public record PostResponseDTO(Long id,
        String title,
        String content,
        String authorUsername,
        String timestamp,
        boolean isLiked,
        boolean status,
        int nbrComments,
        int nbrLikes) {

}
