package com._blog.demo.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.search.GlobalSearchDTO;
import com._blog.demo.dto.search.UserSearchDTO;
import com._blog.demo.entities.User;
import com._blog.demo.repositories.UserRepository;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final UserRepository userRepository;

    public SearchController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
   

    @GetMapping
    public ResponseEntity<GlobalSearchDTO> searchAll(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(new GlobalSearchDTO(List.of()));
        }

        List<User> users = userRepository.findTop5ByUsernameContainingIgnoreCase(query);



        List<UserSearchDTO> mappedUsers = users.stream()
                .map(user -> new UserSearchDTO(user.getId(), user.getUsername()))
                .toList();
      

        return ResponseEntity.ok(new GlobalSearchDTO(mappedUsers));
    }
}
