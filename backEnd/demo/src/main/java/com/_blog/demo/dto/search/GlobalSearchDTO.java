package com._blog.demo.dto.search;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GlobalSearchDTO {
    public GlobalSearchDTO(List<UserSearchDTO> users) {
        this.users = users;
    }

    private List<UserSearchDTO> users;

}
