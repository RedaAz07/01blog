package com._blog.demo.dto;

import java.util.Date;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Must be a valid email address")
    private String email;
    @NotBlank
    @Size(min = 8, max = 20, message = "Password must be at least 8 characters")
    private String password;
    @NotBlank
    @Size(min = 4, max = 20, message = "firstName must be at least 4 characters")
    private String firstName;
    @NotBlank
    @Size(min = 4, max = 20, message = "lastName must be at least 4 characters")
    private String lastName;
    @NotNull(message = "Date is required")
    @Past(message = "Birth date must be in the past")
    private Date birthDate;
    private String profilePictureUrl;

    @Size(max = 500, message = "Bio must be less than 500 characters")
    private String bio;

}
