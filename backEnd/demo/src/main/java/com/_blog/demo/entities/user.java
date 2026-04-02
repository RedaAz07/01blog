package com._blog.demo.entities;

import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private Date birthDate;
    @Column(name = "profilePictureUrl")
    private String profilePictureUrl;
    @Column(name = "status", nullable = false)
    private boolean status;
    @OneToMany(mappedBy = "user_id")
    private List<post> posts;

    @OneToMany(mappedBy = "user_id")
    private List<comment> comments;
    @OneToMany(mappedBy = "user_id")
    private List<like> likes;

    @OneToMany(mappedBy = "reporter_id")
    private List<report> reportsMade;

    @OneToMany(mappedBy = "reported_user_id")
    private List<report> reportsReceived;

}
