package com._blog.demo.entities;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
public class post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "title", nullable = false)
    private String title;
    @Column(name = "content", nullable = false)
    private String content;
    @Column(name = "description", nullable = false)
    private String description;
    @Column(name = "media")
    private String media;
    @Column(name = "timestamp", nullable = false)
    private Date timestamp;
    @Column(name = "status", nullable = false)
    private boolean status;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private user user_id;
    @OneToMany(mappedBy = "post_id" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<comment> comments;
    @OneToMany(mappedBy = "post" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<like> likes;
    @OneToMany(mappedBy = "reportedPost" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<report> reportsReceived;
    
    @OneToMany(mappedBy = "post" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<notification> notifications;

}