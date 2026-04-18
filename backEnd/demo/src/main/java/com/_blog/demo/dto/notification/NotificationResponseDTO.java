package com._blog.demo.dto.notification;

import com._blog.demo.dto.post.PostResponseDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationResponseDTO {

    boolean isRead;
    String senderUsername;
    PostResponseDTO post;
    String timestamp;

}
