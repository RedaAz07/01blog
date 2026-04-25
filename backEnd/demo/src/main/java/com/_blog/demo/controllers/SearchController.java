package com._blog.demo.controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com._blog.demo.dto.search.GlobalSearchDTO;
import com._blog.demo.dto.search.PostSearchDTO;
import com._blog.demo.dto.search.UserSearchDTO;
import com._blog.demo.entities.post;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.postRepository;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private postRepository postRepository;

    @GetMapping
    public ResponseEntity<GlobalSearchDTO> searchAll(@RequestParam("q") String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(new GlobalSearchDTO(List.of(), List.of()));
        }

        List<user> users = userRepository.findTop5ByUsernameContainingIgnoreCase(query);
        List<post> posts = postRepository.findTop5ByTitleContainingIgnoreCase(query);



        List<UserSearchDTO> mappedUsers = users.stream()
                .map(user -> new UserSearchDTO(user.getId(), user.getUsername()))
                .toList();
        List<PostSearchDTO> mappedPosts = posts.stream()
                .map(post -> new PostSearchDTO(post.getId(), post.getTitle()))          
                .toList();


        return ResponseEntity.ok(new GlobalSearchDTO(mappedUsers, mappedPosts));
    }
}