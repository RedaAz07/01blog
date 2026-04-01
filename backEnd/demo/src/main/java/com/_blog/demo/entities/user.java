package com._blog.demo.entities;

import java.util.Date;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
@Entity
@jakarta.persistence.Table(name = "users")
@Getter
@Setter

public class user {

    private String uuid;
    private String username;
    private String email;
    private String password;
    private String role;
    private String firstName;
    private String lastName;
    private Date birthDate;
    private String profilePictureUrl;
    private boolean  status;

}
