package com._blog.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.Comment;
import com._blog.demo.entities.Post;

@Repository
public interface commentRepository extends JpaRepository<Comment, Long> {

    int countByPost(Post postId);

}
