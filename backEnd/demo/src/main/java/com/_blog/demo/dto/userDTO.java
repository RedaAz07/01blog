package com._blog.demo.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class userDTO {
    String username;
    String email;
    String firstName;
    String lastName;
    Date birthDate;
    String profilePictureUrl;
}
