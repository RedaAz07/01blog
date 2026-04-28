package com._blog.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com._blog.demo.dto.like.LikeRequestDTO;
import com._blog.demo.entities.Like;
import com._blog.demo.entities.Post;
import com._blog.demo.entities.User;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.likeRepository;
import com._blog.demo.repositories.postRepository;

@Service
public class LikeService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private postRepository postRepository;
    @Autowired
    private likeRepository likeRepository;

    @Transactional // (Don't forget this from our last fix!)
    public String likeReq(LikeRequestDTO req, String username) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(req.getPostId()).orElseThrow(() -> new RuntimeException("Post not found"));

        if (likeRepository.existsByUserAndPost(user, post)) {
            likeRepository.deleteByUserAndPost(user, post);
            return "Post unliked successfully!";
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            likeRepository.save(like);
        }
        return "Post liked successfully!";
    }
}