package com._blog.demo.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
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

    public ResponseEntity<List<ReportResponseDTO>> getPostReported(Principal    principal) {
        List<ReportResponseDTO> reports = AdminService.getPostReports(principal.getName()); // Assuming you have a service to fetch reports based on the parameter
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/users")
    public ResponseEntity<List<ReportResponseDTO>> getUserReported(Principal    principal) {
        List<ReportResponseDTO> reports = AdminService.getUserReports(principal.getName()); // Assuming you have a service to fetch reports based on the parameter
        return ResponseEntity.ok(reports);
    }

    @PutMapping("/banUser/{username}")
    public ResponseEntity<String> banUser(@PathVariable String username) {
        String res = AdminService.banUser(username);
        return ResponseEntity.ok(res);
    }

    

    @DeleteMapping("/deleteUser/{username}")
    public ResponseEntity<String> deleteUser(@PathVariable String username) {
        String res = AdminService.deleteUser(username);
        return ResponseEntity.ok(res);
    }




    @PutMapping("/hidePost/{id}")
    public ResponseEntity<String> banPost(@PathVariable String id) {
        
        String res = AdminService.hidePost(id);
        return ResponseEntity.ok(res);
    }

}
