package com._blog.demo.dto.dashboard;

import java.time.LocalDate;

public record WeeklyPosts(LocalDate day, long count) {
}
