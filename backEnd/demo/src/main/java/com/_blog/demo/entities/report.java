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
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
public class report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // <-- You need this line!
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "reason", nullable = false)
    private String reason;
    @Column(name = "timestamp", nullable = false)
    private Date timestamp;
    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private user reporter;
    @ManyToOne
    @JoinColumn(name = "reported_user_id", nullable = true)
    private user reported;
    @ManyToOne
    @JoinColumn(name = "reported_post_id", nullable = true)
    private post reported_post;

}
