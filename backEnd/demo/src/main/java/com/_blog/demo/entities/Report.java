package com._blog.demo.entities;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // <-- You need this line!
    @Column(name = "id", nullable = false)
    private Long id;
    @Column(name = "reason", nullable = false)
    private String reason;
    @Column(name = "timestamp", nullable = false)
    private Date timestamp;
    @Column(name = "status")
    private boolean status;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "reported_user_id", nullable = false)
    private User reported;
    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "reported_post_id", nullable = true)
    private Post reportedPost;

}
