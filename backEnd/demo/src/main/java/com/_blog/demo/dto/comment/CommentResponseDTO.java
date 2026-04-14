package com._blog.demo.dto.comment;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentResponseDTO {
private Long id;
private String content;
private String authorUsername;
private Date timestamp;

}
