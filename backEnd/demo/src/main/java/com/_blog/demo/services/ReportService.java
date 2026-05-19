package com._blog.demo.services;

import java.util.Date;

import org.springframework.stereotype.Service;

import com._blog.demo.dto.report.ReportRequestDTO;
import com._blog.demo.entities.Post;
import com._blog.demo.entities.Report;
import com._blog.demo.entities.User;
import com._blog.demo.exceptions.ApiException;
import com._blog.demo.repositories.ReportRepository;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.postRepository;

@Service
public class ReportService {

    private final UserRepository UserRepository;
    private final postRepository postRepository;
    private final ReportRepository reportRepository;

    public ReportService(
            UserRepository userRepository,
            postRepository postRepository,
            ReportRepository reportRepository) {
        this.UserRepository = userRepository;
        this.postRepository = postRepository;
        this.reportRepository = reportRepository;
    }

    public String createReport(ReportRequestDTO entity, String username) {

        User reporter = UserRepository.findByUsername(username)
                .orElseThrow(() -> ApiException.notFound("Reporter not found"));
        User reportedUser = UserRepository.findByUsername(entity.getReported())
                .orElseThrow(() -> ApiException.notFound("Reported user not found"));
        if (reportedUser.getId().equals(reporter.getId())) {
            throw ApiException.badRequest("You cannot report yourself");
        }

        Post reportedPost = null;
        if (entity.getReportedPost() != null) {
            reportedPost = postRepository.findById(entity.getReportedPost())
                    .orElseThrow(() -> ApiException.notFound("Reported post not found"));
            if (!reportedPost.isStatus()) {
                throw ApiException.forbidden("this post is hidden, you can't do anything");
            }
        }
        if (reportedPost != null && reportedPost.getUser().getId().equals(reporter.getId())) {
            throw ApiException.badRequest("You cannot report your own post");
        }
        if (reportedPost != null && !reportedPost.getUser().getId().equals(reportedUser.getId())) {
            throw ApiException.badRequest("The reported post does not belong to the reported user");
        }
       

        Report newReport = new Report();
        newReport.setReason(entity.getReason());
        newReport.setReporter(reporter);
        newReport.setReported(reportedUser);
        newReport.setReportedPost(reportedPost);
        newReport.setTimestamp(new Date());
        reportRepository.save(newReport);
        return "Report created successfully!";

    }

}
