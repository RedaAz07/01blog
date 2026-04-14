package com._blog.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/like") // The base URL for all like stuff
public class LikeController {



    @PostMapping("/")
    public ResponseEntity<String>  postMethodName(@RequestBody String entity) {

        

        
        return ResponseEntity.ok(entity);
    }
    

}
