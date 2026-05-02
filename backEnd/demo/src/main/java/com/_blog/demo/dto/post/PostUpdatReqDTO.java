package com._blog.demo.dto.post;

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
}
