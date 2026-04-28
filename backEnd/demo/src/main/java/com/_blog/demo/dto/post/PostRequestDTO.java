package com._blog.demo.dto.post;

import jakarta.validation.constraints.Size;

public record PostRequestDTO(

        @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters") String title,
        @Size(min = 5, max = 1000, message = "Content must be between 5 and 1000 characters") String content

) {
}