package com._blog.demo.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com._blog.demo.dto.like.LikeResponseDTO;
import com._blog.demo.entities.Like;
import com._blog.demo.entities.Post;
import com._blog.demo.entities.User;
import com._blog.demo.exceptions.ApiException;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.likeRepository;
import com._blog.demo.repositories.postRepository;

@Service
public class LikeService {

    private final UserRepository userRepository;
    private final postRepository postRepository;
    private final likeRepository likeRepository;

    public LikeService(
            UserRepository userRepository,
            postRepository postRepository,
            likeRepository likeRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
    }

    @Transactional
    public LikeResponseDTO likeReq(long req, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> ApiException.notFound("User not found"));

        Post post = postRepository.findById(req)
                .orElseThrow(() -> ApiException.notFound("Post not found"));

        if (!post.isStatus()) {
            throw ApiException.forbidden("this post is hidden, you can't do anything");
        }

        boolean isLiked;

        if (likeRepository.existsByUserAndPost(user, post)) {
            likeRepository.deleteByUserAndPost(user, post);
            isLiked = false;
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);

            likeRepository.save(like);
            isLiked = true;
        }

        int count = likeRepository.countByPost(post);

        return new LikeResponseDTO(count, isLiked);
    }
}
