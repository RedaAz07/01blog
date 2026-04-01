package com._blog.demo.entities;

import java.util.Date;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@jakarta.persistence.Table(name = "users")
@Getter
@Setter
public class user {
    @Column(name = "uuid", nullable = false, unique = true)
    @UuidGenerator
    private String uuid;
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "role", nullable = false)
    private String role;
    private String firstName;
    private String lastName;
    private Date birthDate;
    private String profilePictureUrl;
    private boolean status;

}
