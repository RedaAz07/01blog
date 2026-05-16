package com._blog.demo.dto.post;

import java.util.List;

public record PostResponseDTO(Long id,
                String title,
                String content,
                String authorUsername,
                String timestamp,
                boolean isLiked,
                boolean status,
                int nbrComments,
                int nbrLikes,
                List<String> imageUrls) {

}
