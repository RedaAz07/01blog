package com._blog.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.notification;

@Repository
public interface notificationRepository  extends  JpaRepository<notification, Long>{
    
}
