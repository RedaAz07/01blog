package com._blog.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.RegisterRequestDTO;
import com._blog.demo.services.UserService;

@RestController // Tells Spring this class listens for web traffic
@RequestMapping("/api/users") // The base URL for all user stuff
public class UserController {

    @Autowired
    private UserService userService;

    // Listens for a POST request at: http://localhost:8080/api/users/register
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequestDTO request) {
        
        // Hand the DTO over to the Service layer to do the heavy lifting
        String responseMessage = userService.registerNewUser(request);
        
        // Send a 200 OK HTTP response back to Angular
        return ResponseEntity.ok(responseMessage);
    }
}