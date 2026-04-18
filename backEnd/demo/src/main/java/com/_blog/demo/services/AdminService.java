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
import com._blog.demo.repositories.reportRepository;

@Service
public class AdminService {

    @Autowired
    private reportRepository reportRepository;

    public List<ReportResponseDTO> getPostReports(String param) {
        List<report> reports = reportRepository.findAll().stream()
                .filter(report -> report.getReportedPost() != null && report.getReportedPost().getId().toString().equals(param))
                .toList();
        userDTO reportedUser = reports.stream()
                .map(report -> {
                    user userEntity = report.getReportedPost().getAuthor();
                    userDTO dto = new userDTO();
                    dto.setId(userEntity.getId());
                    dto.setUsername(userEntity.getUsername());
                    return dto;
                })
                .findFirst()
                .orElse(null); // Assuming all reports for the same post will have the same reported user
                
        userDTO reporterUser = new userDTO();
        PostResponseDTO reportedPost = new PostResponseDTO();
        List<ReportResponseDTO> reportDTOs = reports.stream()
                .map(report -> {
                    ReportResponseDTO dto = new ReportResponseDTO();
                    dto.setId(report.getId());
                    dto.setReason(report.getReason());
                    dto.setReporter(reporterUser);
                    dto.setReported(reportedUser);
                    dto.setCreatedAt(report.getTimestamp());
                    dto.setReportedPost(reportedPost);
                    return dto;
                })
                .toList();

        return reportDTOs; // Return the list of report DTOs
    }

    public List<ReportResponseDTO> getUserReports(String param) {
        List<ReportResponseDTO> reports = reportRepository.findByReportedUserId(param); // Implement this method in your repository to fetch reports based on the parameter

        return List.of(); // Return an empty list for now
    }

}
