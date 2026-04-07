package com._blog.demo.entities;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "notifications")
@Setter
@Getter
@NoArgsConstructor
public class notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "is_read", nullable = false)
    private boolean isRead;

    // It is very important to know exactly WHEN the notification was sent!
    @Column(name = "timestamp", nullable = false)
    private Date timestamp;

    // The person who made the post
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private user sender_id;

    // The specific follower receiving this copy of the notification
    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private user receiver_id;

    // THE MISSING PIECE: Which post is this notification about?
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private post post_id;
}