package com._blog.demo.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditProfileRequestDTO {

    @Size(max = 500, message = "Bio must be less than 500 characters")
    String bio;
    @Size(min = 3, max = 50, message = "First name must be less than 50 characters")
    String firstName;
    @Size(min = 3, max = 50, message = "Last name must be less than 50 characters")
    String lastName;
    @Size(min = 3, max = 100, message = "Username must be less than 100 characters")
    String username;
    @Email(message = "Must be a valid email address")
    @Size(min = 3, max = 255, message = "Email must be less than 255 characters")
    String email;

}
