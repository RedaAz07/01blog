package com._blog.demo.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class userDTO {
    Long id;
    String username;
    String role;    
    String email;
    String firstName;
    String lastName;
    Date birthDate;
    String profilePictureUrl;
    int posts;
    int followers;
    int following;
    int notifications;
    boolean FollowingBYMe;
    String bio;
    boolean status;

}
