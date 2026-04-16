package com._blog.demo.dto.notification;

import com._blog.demo.entities.post;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationResponseDTO {

    boolean isRead;
    String senderUsername;
    post post;
    String timestamp;

}
