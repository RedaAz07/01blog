package com._blog.demo.dto.auth;

import jakarta.validation.constraints.Pattern;
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

    @Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$", message = "Must be a valid email address")
    private String email;

}
