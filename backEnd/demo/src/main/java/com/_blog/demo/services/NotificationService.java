package com._blog.demo.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.notification.NotificationResponseDTO;
import com._blog.demo.entities.notification;
import com._blog.demo.entities.post;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;

@Service
public class NotificationService {

    @Autowired
    private UserRepository UserRepository;

   

    public List<NotificationResponseDTO> getNotifications(String username) {
        user userId = UserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        List<NotificationResponseDTO> notifications = userId.getReceivedNotifications().stream().map(notification -> {
            
            NotificationResponseDTO dto = new NotificationResponseDTO();
            dto.setRead(notification.isRead());
            dto.setSenderUsername(notification.getSender().getUsername());
            dto.setPost(notification.getPost());
            dto.setTimestamp(notification.getTimestamp().toString());
            return dto;
        }).toList();

        return notifications;
    }


    public void createNotification(user sender, user receiver , post post) {
        
        for (user follower : sender.getFollowers()) {
            if (follower.getId().equals(receiver.getId())) {
                notification notification = new notification();
                notification.setSender(sender);
                notification.setReceiver(receiver);
                notification.setTimestamp(new Date());
                notification.setRead(false);
                notification.setPost(post);
                UserRepository.save(receiver);
            }
        }
    }
}
