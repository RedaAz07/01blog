package com._blog.demo.dto.post;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Size;

public record PostRequestDTO(
    
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    String title,

    String content,

    @Size(min = 5, max = 200, message = "Description must be at most 200 characters")
    String description,


    MultipartFile mediaFile

) {}