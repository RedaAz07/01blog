package com._blog.demo.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.report.ReportResponseDTO;



@RestController
@RequestMapping("/api/admin")
public class AdminController {
@GetMapping("/Reports/post")
public ResponseEntity<List<ReportResponseDTO>> getPostReported(@RequestParam String param) {


List<ReportResponseDTO> reports = AdminService.getPostReports(param); // Assuming you have a service to fetch reports based on the parameter
    return ResponseEntity.ok(reports);
}
@GetMapping("/Reports/user")
public ResponseEntity<List<ReportResponseDTO>> getUserReported(@RequestParam String param) {
    List<ReportResponseDTO> reports = AdminService.getUserReports(param); // Assuming you have a service to fetch reports based on the parameter
    return ResponseEntity.ok(reports);
}

    
}
