package com._blog.demo.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequestDTO {

    @NotBlank
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;
    @NotBlank
    @Email(message = "Must be a valid email address")
    private String email;
    @NotBlank
    @Size(min = 8, max = 20, message = "Password must be at least 8 characters")
    private String password;
    @NotBlank
    @Size(min = 8, max = 20, message = "firstName must be at least 8 characters")
    private String firstName;
    @NotBlank
    @Size(min = 8, max = 20, message = "lastName must be at least 8 characters")
    private String lastName;
    @NotBlank
    @DateTimeFormat
    private Date birthDate;

    private String profilePictureUrl;

}
