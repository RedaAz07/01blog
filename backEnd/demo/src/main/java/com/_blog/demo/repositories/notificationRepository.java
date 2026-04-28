package com._blog.demo.repositories;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.Notification;

@Repository
public interface notificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByReceiverUsername(String username, Pageable pageable);
void deleteByReceiverUsername(String username);
}
