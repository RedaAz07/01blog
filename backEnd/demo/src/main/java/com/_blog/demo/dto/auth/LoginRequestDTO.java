package com._blog.demo.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {
    @NotBlank(message = "Username is required")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "Username must contain only letters")
    @Size(min = 3, max = 15, message = "Username must be between 3 and 15 characters")
    private String username;
    @NotBlank(message = "password is required")
    @NotBlank(message = "Username is required")
    @Size(min = 8, max = 20, message = "Password must be at least 8 characters")
    private String password;
}