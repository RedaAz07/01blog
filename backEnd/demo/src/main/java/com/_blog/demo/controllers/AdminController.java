package com._blog.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.report.ReportResponseDTO;
import com._blog.demo.services.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService AdminService;

    @GetMapping("/reports/posts")

    public ResponseEntity<List<ReportResponseDTO>> getPostReported() {
        List<ReportResponseDTO> reports = AdminService.getPostReports(); // Assuming you have a service to fetch reports based on the parameter
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/users")
    public ResponseEntity<List<ReportResponseDTO>> getUserReported( ) {
        List<ReportResponseDTO> reports = AdminService.getUserReports(); // Assuming you have a service to fetch reports based on the parameter
        return ResponseEntity.ok(reports);
    }

}
