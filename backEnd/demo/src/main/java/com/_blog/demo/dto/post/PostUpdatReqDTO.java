package com._blog.demo.dto.post;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter

public class PostUpdatReqDTO {

    @NonNull
    private Long id;
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;
    private String content;
    @Size(min = 5, max = 200, message = "Description must be at most 200 characters")
    private String description;

    private MultipartFile mediaFile;

}
