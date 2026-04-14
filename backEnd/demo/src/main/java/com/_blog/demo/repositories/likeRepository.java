package com._blog.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.like;
import com._blog.demo.entities.post;
import com._blog.demo.entities.user;

@Repository
public interface likeRepository extends JpaRepository<like, Long> {

        boolean existsByUserAndPost(user user_id, post post_id);
        void deleteByUserAndPost(user user_id, post post_id);
}
