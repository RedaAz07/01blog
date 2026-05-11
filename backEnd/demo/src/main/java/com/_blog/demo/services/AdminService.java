package com._blog.demo.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.dashboard.PostsDTO;
import com._blog.demo.dto.dashboard.ReportsDTO;
import com._blog.demo.dto.dashboard.Stats;
import com._blog.demo.dto.dashboard.TopReportedDTO;
import com._blog.demo.dto.dashboard.UsersDTO;
import com._blog.demo.dto.dashboard.WeeklyPosts;
import com._blog.demo.entities.Post;
import com._blog.demo.entities.Report;
import com._blog.demo.entities.User;
import com._blog.demo.repositories.ReportRepository;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.commentRepository;
import com._blog.demo.repositories.likeRepository;
import com._blog.demo.repositories.postRepository;

@Service
public class AdminService {

    @Autowired
    private commentRepository commentRepository;

    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private postRepository postRepository;
    @Autowired
    private likeRepository likeRepository;

    public Page<ReportsDTO> getReports(int page, int size, Boolean status) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Report> reports;

        if (status == null) {
            reports = reportRepository.findAll(pageable);

        } else if (status) {
            reports = reportRepository.findByStatus(true, pageable);

        } else {
            reports = reportRepository.findByStatus(false, pageable);
        }

        return reports.map(p -> new ReportsDTO(
                p.getId(),
                p.getReported().getUsername(),
                p.getReporter().getUsername(),
                p.getReason(),
                p.getTimestamp(),
                p.isStatus(),
                p.getReportedPost() != null ? "POST" : "USER"));
    }

    public String ResolveReports(Long id) {
        Report report = reportRepository.findById(id).orElseThrow(() -> new RuntimeException("report not found"));
        if (report.isStatus()) {
            report.setStatus(false);
            reportRepository.save(report);
            return "report resolved Seccefully";
        } else {
            report.setStatus(true);
            reportRepository.save(report);
            return "report resolved Seccefully";
        }

    }

    public String banUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Bro are u crazy ");
        }
        if (user.isStatus()) {

            user.setStatus(false);
            userRepository.save(user);
            return "User Banned seccefully";
        } else {
            user.setStatus(true);
            userRepository.save(user);
            return "User UnBanned seccefully";
        }

    }

    public String deleteUser(String username) {

        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Bro are u crazy ");
        }
        userRepository.delete(user);
        return "User Deleted seccefully";
    }

    public String deletePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not Found"));
        postRepository.delete(post);
        return "post deleted seccefully";
    }

    public String hidePost(String postId) {
        long Id;
        try {
            Id = Long.parseLong(postId);
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid  ID format: ");
        }
        // user user = userRepository.findByUsername(username).orElseThrow(() -> new
        // RuntimeException("Post not found"));
        Post post = postRepository.findById(Id).orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.isStatus()) {

            post.setStatus(false);
            postRepository.save(post);
            return "Post hide seccefully";
        } else {
            post.setStatus(true);
            postRepository.save(post);
            return "Post Unhide seccefully";
        }
    }

    public Stats getStats() {

        Long posts = postRepository.count();
        Long users = userRepository.count();
        Long banned = userRepository.countByStatusFalse();
        Long reports = reportRepository.count();

        return new Stats(posts, users, reports, banned);

    }

    public List<WeeklyPosts> getWeeklyPosts() {

        List<WeeklyPosts> result = postRepository.getPostsLast7Days()
                .stream()
                .map(r -> new WeeklyPosts(
                        (LocalDate) r[0],
                        ((Number) r[1]).longValue()))
                .toList();

        return result;
    }

    public List<TopReportedDTO> getTopReported() {

        List<TopReportedDTO> result = reportRepository.findTop5Reports()
                .stream()
                .map(r -> new TopReportedDTO(
                        (Long) r[0],
                        (String) r[1],
                        (String) r[2],
                        (String) r[3],
                        (Boolean) r[4]))
                .toList();

        return result;
    }

    public Page<UsersDTO> getAllUsers(int size, int page, Boolean status) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<User> users;
        if (status == null) {

            users = userRepository.findByRoleNot("ROLE_ADMIN", pageable);
        } else if (status) {
            users = userRepository.findByRoleNotAndStatus("ROLE_ADMIN", true, pageable);
        } else {
            users = userRepository.findByRoleNotAndStatus("ROLE_ADMIN", false, pageable);

        }
        return users.map(r -> new UsersDTO(
                r.getId(),
                r.getUsername(),
                r.getFirstName(),
                r.getLastName(),
                r.getRole(),
                r.isStatus(),
                r.getPosts().size(),
                r.getReportsReceived().size(),
                r.getCreatedAt()));
    }

    public Page<PostsDTO> getAllPosts(int page, int size, Boolean status) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("id").descending());

        Page<Post> posts = (status == null)
                ? postRepository.findAll(pageable)
                : postRepository.findByStatus(pageable, status);

        return posts.map(r -> new PostsDTO(
                r.getId(),
                r.getUser().getUsername(),
                r.getTitle(),
                r.getContent(),
                r.getLikes().size(),
                r.getReportsReceived().size(),
                r.isStatus(),
                r.getTimestamp()));
    }
}
