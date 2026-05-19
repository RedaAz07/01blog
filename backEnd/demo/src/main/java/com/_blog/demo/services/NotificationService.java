package com._blog.demo.services;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.notification.NotificationResponseDTO;
import com._blog.demo.dto.post.PostResponseDTO;
import com._blog.demo.entities.Notification;
import com._blog.demo.entities.Post;
import com._blog.demo.entities.User;
import com._blog.demo.exceptions.ApiException;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.commentRepository;
import com._blog.demo.repositories.likeRepository;
import com._blog.demo.repositories.notificationRepository;
import com._blog.demo.repositories.postRepository;

@Service
public class NotificationService {

    private final UserRepository UserRepository;
    private final notificationRepository notificationRepository;
    private final likeRepository likeRepository;
    private final commentRepository commentRepository;
    private final postRepository postRepository;

    public NotificationService(
            UserRepository userRepository,
            notificationRepository notificationRepository,
            likeRepository likeRepository,
            commentRepository commentRepository,
            postRepository postRepository) {
        this.UserRepository = userRepository;
        this.notificationRepository = notificationRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public Page<NotificationResponseDTO> getNotifications(String username, int page, int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Notification> notifP = notificationRepository.findByReceiverUsername(username, pageable);

        return notifP.map(notif -> new NotificationResponseDTO(
            notif.getId(),  
            notif.isRead(),
                notif.getSender().getUsername(),
                notif.getPost().getId(),
                notif.getTimestamp().toString()
        ));
    }
    public void createNotification(String senderUsername, PostResponseDTO post) {
        Post currPost = postRepository.findById(post.id()).orElseThrow(() -> ApiException.notFound("Post not found with id: " + post.id()));

        User sender = UserRepository.findByUsername(senderUsername)
                .orElseThrow(() -> ApiException.notFound("User not found with username: " + senderUsername));
        for (User follower : sender.getFollowers()) {
            Notification notification = new Notification();
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
            throw ApiException.badRequest("Invalid notification ID format: " + id);
        }
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> ApiException.notFound("Notification not found with id: " + id));
        if (!notification.getReceiver().getUsername().equals(username)) {
            throw ApiException.forbidden("You are not authorized to mark this notification as read");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }


    public void clearNotifications(String username) {
        notificationRepository.deleteByReceiverUsername(username);
    }
}
