package com._blog.demo.dto.dashboard;

public record PostsDTO(Long id , String author ,String title , String content , int likes , int reports , boolean  status ,java.util.Date date) {
    
}
