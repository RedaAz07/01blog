package com._blog.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.post;
import com._blog.demo.entities.user;

@Repository
public interface postRepository extends JpaRepository<post, Long> {

    public boolean likedByUserAndPost(user userId, post postId);

    public int countCommentsByPost(post postId);

    public int countLikesByPost(post postId);

}
