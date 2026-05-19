package com._blog.demo.dto.dashboard;

import java.util.List;

public record PostsDTO(Long id , String author ,String title , String content , int likes , int reports , boolean  status ,java.util.Date date, List<String> imageUrl, int comments) {
    
}
