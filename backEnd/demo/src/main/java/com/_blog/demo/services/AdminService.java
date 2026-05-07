package com._blog.demo.services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.dashboard.Stats;
import com._blog.demo.dto.dashboard.TopReportedDTO;
import com._blog.demo.dto.dashboard.WeeklyPosts;
import com._blog.demo.dto.post.PostResponseDTO;
import com._blog.demo.dto.report.ReportResponseDTO;
import com._blog.demo.dto.userDTO;
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

    public Page<ReportResponseDTO> getPostReports(String username, int page, int size) {
        User auth = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Report> postPage = reportRepository.findByReportedPostIsNotNull(pageable);

        return postPage
                .map(report -> mapToReportDTO(report, auth));
    }

    public Page<ReportResponseDTO> getUserReports(String username, int page, int size) {
        User auth = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Report> userReports = reportRepository.findByReportedPostIsNull(pageable);

        return userReports
                .map(report -> mapToReportDTO(report, auth));
    }

    private ReportResponseDTO mapToReportDTO(Report report, User auth) {
        ReportResponseDTO dto = new ReportResponseDTO();
        dto.setId(report.getId());
        dto.setReason(report.getReason());
        dto.setCreatedAt(report.getTimestamp());

        // Use the smaller helper methods for the complex objects
        dto.setReporter(mapToUserDTO(report.getReporter()));
        dto.setReported(mapToUserDTO(report.getReported()));

        // Safely check for null before mapping the post! (Fixes the crash)
        if (report.getReportedPost() != null) {
            dto.setReportedPost(mapToPostDTO(report.getReportedPost(), auth));
        }

        return dto;
    }

    private userDTO mapToUserDTO(User u) {
        if (u == null) {
            return null;
        }
        userDTO dto = new userDTO();
        dto.setUsername(u.getUsername());
        dto.setEmail(u.getEmail());
        dto.setFirstName(u.getFirstName());
        dto.setLastName(u.getLastName());
        dto.setBirthDate(u.getBirthDate());
        return dto;
    }

    private PostResponseDTO mapToPostDTO(Post p, User auth) {
        if (p == null) {
            return null;
        }

        PostResponseDTO dto = new PostResponseDTO(
                p.getId(),
                p.getTitle(),
                p.getContent(),
                p.getUser() != null ? p.getUser().getUsername() : "Unknown",
                p.getTimestamp() != null ? p.getTimestamp().toString() : null,
                likeRepository.existsByUserAndPost(auth, p),
                commentRepository.countByPost(p),
                likeRepository.countByPost(p));
        return dto;
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

}
