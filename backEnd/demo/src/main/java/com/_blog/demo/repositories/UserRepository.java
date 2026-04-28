package com._blog.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // You get save(), findAll(), findById(), and deleteById() FOR FREE!
    // If you need custom searches, you just name the method correctly:
    Optional<User> findByUsername(String username);

  List<User> findTop5ByUsernameContainingIgnoreCase(String query);

    Optional<User> findByEmail(String email);


    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
