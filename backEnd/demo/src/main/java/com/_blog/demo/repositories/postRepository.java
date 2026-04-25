package com._blog.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.post;

@Repository
public interface postRepository extends JpaRepository<post, Long> {


     List<post> findTop5ByTitleContainingIgnoreCase(String query);


}
