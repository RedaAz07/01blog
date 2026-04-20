package com._blog.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.comment;
import com._blog.demo.entities.post;

@Repository
public interface commentRepository extends JpaRepository<comment, Long> {

    int countByPost(post postId);

}
