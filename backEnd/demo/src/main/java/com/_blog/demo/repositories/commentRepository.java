package com._blog.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com._blog.demo.entities.comment;

public interface commentRepository extends JpaRepository<comment, Long> {

    comment save(comment newComment);

    List<comment> findAll();

}
