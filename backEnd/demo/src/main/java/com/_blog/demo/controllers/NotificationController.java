package com._blog.demo.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.notification.NotificationResponseDTO;
import com._blog.demo.services.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService NotificationService;

    @GetMapping("/")
    public ResponseEntity<List<NotificationResponseDTO>> getNotifications(Principal principal) {
        String username = principal.getName();
        List<NotificationResponseDTO> notifications = NotificationService.getNotifications(username);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("read/{id}")
    public String markAsRead(@PathVariable String id, @RequestBody String entity, Principal principal) {
        String username = principal.getName();
        NotificationService.markAsRead(id, username);
        return "Notification marked as read";
    }

}
