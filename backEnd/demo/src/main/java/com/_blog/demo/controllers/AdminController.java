package com._blog.demo.controllers;

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
import com._blog.demo.dto.dashboard.PostsDTO;
import com._blog.demo.dto.dashboard.ReportsDTO;
import com._blog.demo.dto.dashboard.Stats;
import com._blog.demo.dto.dashboard.TopReportedDTO;
import com._blog.demo.dto.dashboard.UsersDTO;
import com._blog.demo.dto.dashboard.WeeklyPosts;
import com._blog.demo.services.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService AdminService;

    @GetMapping("/reports")
    public ResponseEntity<Page<ReportsDTO>> getPostReported(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Boolean status) {
        Page<ReportsDTO> reports = AdminService.getReports(page, size, status);

        return ResponseEntity.ok(reports);
    }

    @PutMapping("reports/{id}")
    public ResponseEntity<Response> ResolveReports(@PathVariable Long id) {

        String res = AdminService.ResolveReports(id);
        return ResponseEntity.ok(new Response(res));
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

    @DeleteMapping("/deletePost/{id}")
    public ResponseEntity<Response> deletePost(@PathVariable Long id) {
        String res = AdminService.deletePost(id);
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

    @GetMapping("stats/users")
    public ResponseEntity<Page<UsersDTO>> getAllUsres(
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(required = false) Boolean status) {

        Page<UsersDTO> result = AdminService.getAllUsers(size, page, status);

        return ResponseEntity.ok(result);
    }

    @GetMapping("stats/posts")
    public ResponseEntity<Page<PostsDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Boolean status) {
        Page<PostsDTO> posts = AdminService.getAllPosts(page, size, status);
        return ResponseEntity.ok(posts);
    }

}
