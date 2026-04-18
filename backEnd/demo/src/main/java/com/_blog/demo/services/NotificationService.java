package com._blog.demo.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.notification.NotificationResponseDTO;
import com._blog.demo.dto.post.PostResponseDTO;
import com._blog.demo.entities.notification;
import com._blog.demo.entities.post;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.notificationRepository;
import com._blog.demo.repositories.postRepository;

@Service
public class NotificationService {

    @Autowired
    private UserRepository UserRepository;
    @Autowired
    private notificationRepository notificationRepository;

    public List<NotificationResponseDTO> getNotifications(String username) {
        user userId = UserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        List<NotificationResponseDTO> notifications = userId.getReceivedNotifications().stream().filter(notification -> !notification.isRead()).map(notification -> {
            PostResponseDTO post = new PostResponseDTO();
            post.setId(notification.getPost().getId());
            post.setTitle(notification.getPost().getTitle());
            post.setContent(notification.getPost().getContent());
            post.setDescription(notification.getPost().getDescription());
            post.setMediaUrl(notification.getPost().getMedia());
            post.setTimestamp(notification.getPost().getTimestamp().toString());
            post.setAuthorUsername(notification.getPost().getUser_id().getUsername());
            NotificationResponseDTO dto = new NotificationResponseDTO();
            dto.setRead(notification.isRead());
            dto.setSenderUsername(notification.getSender().getUsername());
            dto.setPost(post);
            dto.setTimestamp(notification.getTimestamp().toString());
            return dto;
        }).toList();

        return notifications;
    }

    @Autowired
    private postRepository postRepository;

    public void createNotification(String senderUsername, PostResponseDTO post) {
        post currPost = postRepository.findById(post.getId()).orElseThrow(() -> new RuntimeException("Post not found with id: " + post.getId()));

        user sender = UserRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + senderUsername));
        for (user follower : sender.getFollowers()) {
            System.err.println("111111111111111111");
            notification notification = new notification();
            notification.setSender(sender);
            notification.setReceiver(follower);
            notification.setTimestamp(new Date());
            notification.setRead(false);
            notification.setPost(currPost);
            notificationRepository.save(notification);

        }
    }

    public void markAsRead(String id, String username) {
        long notificationId;
        try {
            notificationId = Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid notification ID format: " + id);
        }
        notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        if (!notification.getReceiver().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to mark this notification as read");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }
}
