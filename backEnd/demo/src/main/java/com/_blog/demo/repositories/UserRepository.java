package com._blog.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.user;

@Repository
public interface UserRepository extends JpaRepository<user, Long> {

    // You get save(), findAll(), findById(), and deleteById() FOR FREE!
    // If you need custom searches, you just name the method correctly:
    Optional<user> findByUsername(String username);

    Optional<user> findByEmail(String email);

    List<user> findAll();

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
