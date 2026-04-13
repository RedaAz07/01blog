package com._blog.demo.dto.post;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ResponePost {

    private Long id;
    private String title;
    private String content;
    private String mediaUrl;
    private String authorUsername;

    // Getters and Setters
}
