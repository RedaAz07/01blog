package com._blog.demo.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.userDTO;
import com._blog.demo.services.UserService;



@RestController // Tells Spring this class listens for web traffic
@RequestMapping("/api/users") // The base URL for all user stuff
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/allUsers") // This method will handle GET requests to /api/users/allUsers
    public List<userDTO> getMethodName() {

        return userService.findAllUsers();
    }
    @GetMapping("/me")
    public userDTO getCurrentUser(Principal principal) {
        String param = principal.getName();
        userDTO user = userService.getCurrentUser(param);
        return user;
    }
  
    

}
