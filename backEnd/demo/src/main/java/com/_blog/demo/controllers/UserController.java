package com._blog.demo.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.auth.EditProfileRequestDTO;
import com._blog.demo.dto.userDTO;
import com._blog.demo.services.UserService;

import jakarta.validation.Valid;

@RestController // Tells Spring this class listens for web traffic
@RequestMapping("/api/users") // The base URL for all user stuff
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

   

    @GetMapping("/me")
    public userDTO getCurrentUser(Principal principal) {
        String param = principal.getName();
        userDTO user = userService.getCurrentUser(param);
        return user;
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<userDTO>> getMethodName(Principal principal) {
        String param = principal.getName();
        List<userDTO> suggestions = userService.getSuggestions(param);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<userDTO> getMethodName(@PathVariable String username, Principal principal) {
        String param = principal.getName();
        userDTO user = userService.getUserByUsername(username, param);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("edit/{username}")
    public ResponseEntity<userDTO> putMethodName( @PathVariable String username,
           @Valid @RequestBody EditProfileRequestDTO entity, Principal principal) {
        String param = principal.getName();
        userDTO response = userService.editProfile(username, entity, param);
        return ResponseEntity.ok(response);
    }

}
