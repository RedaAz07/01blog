package com._blog.demo.services;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com._blog.demo.dto.report.ReportRequestDTO;
import com._blog.demo.entities.post;
import com._blog.demo.entities.report;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.postRepository;
import com._blog.demo.repositories.reportRepository;

@Service
public class ReportService {

    @Autowired
    private UserRepository UserRepository;
    @Autowired
    private postRepository postRepository;
    @Autowired
    private reportRepository reportRepository;

    public String createReport(ReportRequestDTO entity, String username) {

        user reporter = UserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Reporter not found"));
        user reportedUser = UserRepository.findById(entity.getReported()).orElseThrow(() -> new RuntimeException("Reported user not found"));
        if (reportedUser.getId().equals(reporter.getId())) {
            throw new RuntimeException("You cannot report yourself");
        }

        post reportedPost = null;
        if (entity.getReportedPost() != null) {
            reportedPost = postRepository.findById(entity.getReportedPost()).orElseThrow(() -> new RuntimeException("Reported post not found"));
        }
        if (reportedPost != null && reportedPost.getUser_id().getId().equals(reporter.getId())) {
            throw new RuntimeException("You cannot report your own post");
        }
        if (reportedPost != null && !reportedPost.getUser_id().getId().equals(reportedUser.getId())) {
            throw new RuntimeException("You cannot report a post of the user you are reporting");
        }
        if (reportedPost== null && reportRepository.existsByReporterAndReported(reporter, reportedUser)) {
            throw new RuntimeException("You have already reported this user");
        }
        if (reportedPost != null && reportRepository.existsByReporterAndReportedAndReportedPost(reporter, reportedUser, reportedPost)) {
            throw new RuntimeException("You have already reported this post of this user");
        }

        report newReport = new report();
        newReport.setReason(entity.getReason());
        newReport.setReporter(reporter);
        newReport.setReported(reportedUser);
        newReport.setReportedPost(reportedPost);
        newReport.setTimestamp(new Date());
        reportRepository.save(newReport);
        return "Report created successfully!";

    }

}
