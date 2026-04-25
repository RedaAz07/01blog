package com._blog.demo.dto.notification;


public record NotificationResponseDTO(
long id,
    boolean isRead,
    String senderUsername,
    long post,
    String timestamp
) {


}
