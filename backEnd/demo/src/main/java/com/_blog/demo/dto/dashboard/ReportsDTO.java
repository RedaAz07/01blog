package com._blog.demo.dto.dashboard;

import java.util.Date;

public record ReportsDTO(Long id, String reported, String reporter, String reasen, Date date, boolean status,
        String type) {

}
