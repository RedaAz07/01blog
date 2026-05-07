package com._blog.demo.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com._blog.demo.dto.Response;
import com._blog.demo.dto.dashboard.Stats;
import com._blog.demo.dto.dashboard.TopReportedDTO;
import com._blog.demo.dto.dashboard.WeeklyPosts;
import com._blog.demo.dto.report.ReportResponseDTO;
import com._blog.demo.services.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService AdminService;

    @GetMapping("/reports/posts")
    public ResponseEntity<Page<ReportResponseDTO>> getPostReported(Principal principal,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<ReportResponseDTO> reports = AdminService.getPostReports(principal.getName(), page, size);

        return ResponseEntity.ok(reports);
    }

    @GetMapping("/reports/users")
    public ResponseEntity<Page<ReportResponseDTO>> getUserReported(Principal principal,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<ReportResponseDTO> reports = AdminService.getUserReports(principal.getName(), page, size);

        return ResponseEntity.ok(reports);
    }

    @PutMapping("/banUser/{username}")
    public ResponseEntity<Response> banUser(@PathVariable String username) {
        String res = AdminService.banUser(username);
        return ResponseEntity.ok(new Response(res));
    }

    @DeleteMapping("/deleteUser/{username}")
    public ResponseEntity<Response> deleteUser(@PathVariable String username) {
        String res = AdminService.deleteUser(username);
        return ResponseEntity.ok(new Response(res));
    }

    @PutMapping("/hidePost/{id}")
    public ResponseEntity<Response> banPost(@PathVariable String id) {

        String res = AdminService.hidePost(id);
        return ResponseEntity.ok(new Response(res));
    }

    @GetMapping("stats/totals")
    public ResponseEntity<Stats> getTotals() {
        Stats states = AdminService.getStats();
        return ResponseEntity.ok(states);
    }

    @GetMapping("stats/weeklyPosts")
    public ResponseEntity<List<WeeklyPosts>> getWeeklyPosts() {
        List<WeeklyPosts> weeklyPosts = AdminService.getWeeklyPosts();
        return ResponseEntity.ok(weeklyPosts);
    }

     @GetMapping("stats/TopReporeted")
    public ResponseEntity<List<TopReportedDTO>> getTopReported() {
        List<TopReportedDTO> weeklyPosts = AdminService.getTopReported();
        return ResponseEntity.ok(weeklyPosts);
    }
}
