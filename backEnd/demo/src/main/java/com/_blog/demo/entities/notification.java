package com._blog.demo.entities;

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

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private user sender_id;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private user receiver_id;

}
