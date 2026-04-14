package com._blog.demo.dto.comment;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class CommentRequestDTO {


    private Long postId;
    @Size(min = 1, max = 500, message = "Comment content must be between 1 and 500 characters")
    private String content;
}
