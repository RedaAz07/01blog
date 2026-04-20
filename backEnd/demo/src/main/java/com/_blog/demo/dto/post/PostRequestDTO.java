package com._blog.demo.dto.post;

import org.springframework.web.multipart.MultipartFile;

import com._blog.demo.validators.ValidFileType;

import jakarta.validation.constraints.Size;

public record PostRequestDTO(
    
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    String title,

    String content,

    @Size(min = 5, max = 200, message = "Description must be at most 200 characters")
    String description,

    @ValidFileType(allowedTypes = {"image/jpeg", "image/png", "video/mp4", "video/webm"},
            message = "Bro, you can only upload JPG, PNG, MP4, or WEBM files!")
    MultipartFile mediaFile

) {}