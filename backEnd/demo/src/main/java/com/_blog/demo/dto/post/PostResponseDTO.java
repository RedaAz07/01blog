package com._blog.demo.dto.post;

public record PostResponseDTO(Long id,
        String title,
        String content,
        String mediaUrl,
        String description,
        String authorUsername,
        String timestamp,
        boolean isLiked,
        int nbrComments,
        int nbrLikes) {

}
