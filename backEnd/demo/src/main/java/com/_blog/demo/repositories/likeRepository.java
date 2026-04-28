package com._blog.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.Like;
import com._blog.demo.entities.Post;
import com._blog.demo.entities.User;

@Repository
public interface likeRepository extends JpaRepository<Like, Long> {

        boolean existsByUserAndPost(User user_id, Post post_id);
        void deleteByUserAndPost(User user_id, Post post_id);
        int countByPost(Post post_id);
        
}
