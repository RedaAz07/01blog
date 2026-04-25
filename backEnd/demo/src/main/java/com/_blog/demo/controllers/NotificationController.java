package com._blog.demo.controllers;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.Response;
import com._blog.demo.dto.notification.NotificationResponseDTO;
import com._blog.demo.services.NotificationService;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService NotificationService;

    @GetMapping("/")
    public ResponseEntity<Page<NotificationResponseDTO>> getNotifications(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size, Principal principal) {
        String username = principal.getName();
        Page<NotificationResponseDTO> notifications = NotificationService.getNotifications(username, page, size);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("read/{id}")
    public ResponseEntity<Response> markAsRead(@PathVariable String id, @RequestBody String entity, Principal principal) {
        String username = principal.getName();
        NotificationService.markAsRead(id, username);
        return ResponseEntity.ok(new Response("Notification marked as read"));
    }

            @Transactional
    @DeleteMapping("/clear")
    public ResponseEntity<Response> clearNotifications(Principal principal) {
        String username = principal.getName();
        NotificationService.clearNotifications(username);
        return ResponseEntity.ok(new Response("All notifications cleared"));
    }
}
