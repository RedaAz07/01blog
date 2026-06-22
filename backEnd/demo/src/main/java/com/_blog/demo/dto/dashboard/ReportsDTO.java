package com._blog.demo.dto.dashboard;

import java.util.Date;

public record ReportsDTO(Long id, Long reportedUserId ,Long reportedPostId, String reported, String reporter, String reasen, Date date, boolean status,
        String type, Long reportedPost) {

}
