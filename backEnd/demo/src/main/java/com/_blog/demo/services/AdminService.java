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
import com._blog.demo.repositories.reportRepository;

@Service
public class AdminService {

    @Autowired
    private reportRepository reportRepository;

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
        if (u == null) return null;
        userDTO dto = new userDTO();
        dto.setUsername(u.getUsername());
        dto.setEmail(u.getEmail());
        dto.setFirstName(u.getFirstName());
        dto.setLastName(u.getLastName());
        dto.setBirthDate(u.getBirthDate());
        return dto;
    }

    private PostResponseDTO mapToPostDTO(post p) {
        if (p == null) return null;
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
}