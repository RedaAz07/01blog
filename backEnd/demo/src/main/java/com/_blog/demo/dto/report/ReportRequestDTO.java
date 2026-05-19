package com._blog.demo.dto.report;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ReportRequestDTO {
    @Size(min = 5, max = 100, message = "Reason must be between 1 and 100 characters")
    private String reason;
    @NotNull(message = "Reporter ID cannot be null")
    private String reported; 

    private Long reportedPost; // Optional, can be null
}
