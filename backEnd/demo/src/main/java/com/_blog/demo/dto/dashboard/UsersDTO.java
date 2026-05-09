package com._blog.demo.dto.dashboard;

import java.time.LocalDateTime;

public record UsersDTO(Long id , String username, String firstName, String lastName, String role, boolean status, int posts,
        int reports, LocalDateTime joined) {

}
