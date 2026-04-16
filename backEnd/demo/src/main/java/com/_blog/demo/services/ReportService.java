package com._blog.demo.services;

import org.springframework.beans.factory.annotation.Autowired;

import com._blog.demo.dto.report.ReportRequestDTO;
import com._blog.demo.entities.post;
import com._blog.demo.entities.report;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.postRepository;
import com._blog.demo.repositories.reportRepository;

public class ReportService {

    @Autowired
    private static UserRepository UserRepository;
    @Autowired
    private static postRepository postRepository;
    @Autowired
    private static reportRepository reportRepository;

    public static String createReport(ReportRequestDTO entity, String username) {

        user reporter = UserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        user reportedUser = UserRepository.findById(entity.getReportedUserId()).orElseThrow(() -> new RuntimeException("Reported user not found"));
        if (reportedUser.getId().equals(reporter.getId())) {
            throw new RuntimeException("You cannot report yourself");
        }

        post reportedPost = null;
        if (entity.getReportedPostId() != null) {
            reportedPost = postRepository.findById(entity.getReportedPostId()).orElseThrow(() -> new RuntimeException("Reported post not found"));
            if (reportedPost.getUser_id().getId().equals(reporter.getId())) {
                throw new RuntimeException("You cannot report your own post");
            }
            report newReport = new report();
            newReport.setReason(entity.getReason());
            newReport.setReporter(reporter);
            newReport.setReported(reportedUser);
            newReport.setReported_post(reportedPost);
            // Save the report to the database (you need to implement this part)
            reportRepository.save(newReport);
            return "Report created successfully!";
        }else{
            report newReport = new report();
            newReport.setReason(entity.getReason());
            newReport.setReporter(reporter);
            newReport.setReported(reportedUser);
            reportRepository.save(newReport);
        }

        return "Report created successfully!";
    }

}
