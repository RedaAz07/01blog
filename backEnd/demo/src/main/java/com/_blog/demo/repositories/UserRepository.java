package com._blog.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


  
  Optional<User> findByUsername(String username);

  List<User> findTop5ByUsernameContainingIgnoreCase(String query);

  Optional<User> findByEmail(String email);

  boolean existsByUsername(String username);

  boolean existsByEmail(String email);

  @Query(value = """
      SELECT * FROM users
      WHERE id <> :userId
      AND id NOT IN (
          SELECT followed_id FROM user_follows WHERE follower_id = :userId
      )
      ORDER BY RANDOM()
      LIMIT 10
      """, nativeQuery = true)
  List<User> findRandomUsers(Long userId);
}
