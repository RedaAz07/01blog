package com._blog.demo.controllers;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.Response;
import com._blog.demo.dto.report.ReportRequestDTO;
import com._blog.demo.services.ReportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService ReportService;

    public ReportController(ReportService reportService) {
        this.ReportService = reportService;
    }

    @PostMapping("/")

    public ResponseEntity<Response> postMethodName(@Valid @RequestBody ReportRequestDTO entity, Principal principal) {
        String username = principal.getName();
        String response = ReportService.createReport(entity, username);
        return ResponseEntity.ok(new Response(response));
    }

}
