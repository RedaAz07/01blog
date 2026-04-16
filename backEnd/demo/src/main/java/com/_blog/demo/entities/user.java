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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class user {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "role", nullable = false)
    private String role;
    @Column(name = "firstName", nullable = false)
    private String firstName;
    @Column(name = "lastName", nullable = false)
    private String lastName;
    @Column(name = "birthDate", nullable = false)
    private Date   birthDate;
    @Column(name = "profilePictureUrl")
    private String profilePictureUrl;
    @Column(name = "status", nullable = false)
    private boolean status;
    @OneToMany(mappedBy = "user_id")
    private List<post> posts;

    @OneToMany(mappedBy = "user_id" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<comment> comments;
    @OneToMany(mappedBy = "user" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<like> likes;

    @OneToMany(mappedBy = "reporter" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<report> reportsMade;

    @OneToMany(mappedBy = "reported" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<report> reportsReceived;
    @ManyToMany
    @JoinTable(name = "user_follows" , joinColumns = @JoinColumn(name = "follower_id" ), inverseJoinColumns = @JoinColumn(name = "followed_id"))
    private List<user> following;


    @ManyToMany(mappedBy = "following")
    private List<user> followers;

    @OneToMany(mappedBy = "sender" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<notification> sentNotifications;

    @OneToMany(mappedBy = "receiver" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<notification> receivedNotifications;
}
