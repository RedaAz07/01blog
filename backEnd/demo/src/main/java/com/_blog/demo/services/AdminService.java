package com._blog.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.post.PostResponseDTO;
import com._blog.demo.dto.report.ReportResponseDTO;
import com._blog.demo.dto.userDTO;
import com._blog.demo.entities.post;
import com._blog.demo.entities.report;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.postRepository;
import com._blog.demo.repositories.reportRepository;

@Service
public class AdminService {

    @Autowired
    private reportRepository reportRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private postRepository postRepository;

    public List<ReportResponseDTO> getPostReports() {
        return reportRepository.findByReportedPostIsNotNull()
                .stream()
                .map(this::mapToReportDTO) // Points to the helper method below
                .toList();
    }

    public List<ReportResponseDTO> getUserReports() {
        return reportRepository.findByReportedPostIsNull()
                .stream()
                .map(this::mapToReportDTO)
                .toList();
    }

    private ReportResponseDTO mapToReportDTO(report report) {
        ReportResponseDTO dto = new ReportResponseDTO();
        dto.setId(report.getId());
        dto.setReason(report.getReason());
        dto.setCreatedAt(report.getTimestamp());

        // Use the smaller helper methods for the complex objects
        dto.setReporter(mapToUserDTO(report.getReporter()));
        dto.setReported(mapToUserDTO(report.getReported()));

        // Safely check for null before mapping the post! (Fixes the crash)
        if (report.getReportedPost() != null) {
            dto.setReportedPost(mapToPostDTO(report.getReportedPost()));
        }

        return dto;
    }

    private userDTO mapToUserDTO(user u) {
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

    private PostResponseDTO mapToPostDTO(post p) {
        if (p == null) {
            return null;
        }
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(p.getId());
        dto.setTitle(p.getTitle());
        dto.setContent(p.getContent());
        dto.setDescription(p.getDescription());
        dto.setMediaUrl(p.getMedia());

        if (p.getUser_id() != null) {
            dto.setAuthorUsername(p.getUser_id().getUsername());
        }
        return dto;
    }

    public String banUser(String username) {
        user user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Post not found"));

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
        user user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
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
        //   user user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Post not found"));
        post post = postRepository.findById(Id).orElseThrow(() -> new RuntimeException("Post not found"));

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

}
