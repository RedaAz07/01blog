package com._blog.demo.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.Post;

@Repository
public interface postRepository extends JpaRepository<Post, Long> {
  @Override
  Page<Post> findAll(Pageable pageable);

  Page<Post> findByStatus(Pageable pageable, boolean status);

  List<Post> findTop5ByTitleContainingIgnoreCase(String query);

  Page<Post> findByUserUsername(String username, Pageable pageable);

  @Query(value = """
          SELECT
            d.day AS day,
            COALESCE(COUNT(p.id), 0) AS count
          FROM (
            SELECT generate_series(
              CURRENT_DATE - INTERVAL '6 days',
              CURRENT_DATE,
              INTERVAL '1 day'
            )::date AS day
          ) d
          LEFT JOIN posts p
            ON DATE(p.timestamp) = d.day
          GROUP BY d.day
          ORDER BY d.day
      """, nativeQuery = true)
  List<Object[]> getPostsLast7Days();
}
