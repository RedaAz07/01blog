package com._blog.demo.dto.report;

import java.util.Date;

import com._blog.demo.dto.post.PostResponseDTO;
import com._blog.demo.dto.userDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportResponseDTO {

    private Long id;
    private String reason;
    private userDTO reported;
    private userDTO reporter;
    private Date createdAt;
    private PostResponseDTO reportedPost;

}
