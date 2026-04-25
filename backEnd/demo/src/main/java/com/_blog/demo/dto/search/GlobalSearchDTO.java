package com._blog.demo.dto.search;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class GlobalSearchDTO {
    public GlobalSearchDTO(List<UserSearchDTO> users, List<PostSearchDTO> posts) {
        this.users = users;
        this.posts = posts;
    }

    private List<UserSearchDTO> users;
    private List<PostSearchDTO> posts;

}
