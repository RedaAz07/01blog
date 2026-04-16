package com._blog.demo.services;

import org.springframework.beans.factory.annotation.Autowired;

import com._blog.demo.dto.report.ReportRequestDTO;
import com._blog.demo.entities.post;
import com._blog.demo.entities.user;
import com._blog.demo.repositories.UserRepository;
import com._blog.demo.repositories.postRepository;

public class ReportService {

    @Autowired
    private static UserRepository UserRepository;
    @Autowired
    private static postRepository postRepository;
    public static String createReport(ReportRequestDTO entity, String username) {

        user reporter = UserRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        user reportedUser = UserRepository.findById(entity.getReportedUserId()).orElseThrow(() -> new RuntimeException("Reported user not found"));
        if (reportedUser.getId().equals(reporter.getId())) {
            throw new RuntimeException("You cannot report yourself");
        }
        post reportedPost = null;
        if (entity.getReportedPostId() != null) {
            reportedPost = postRepository.findById(entity.getReportedPostId()).orElseThrow(() -> new RuntimeException("Reported post not found"));
            
        }
        if (reportedUser == null && reportedPost == null) {
            throw new RuntimeException("You must report either a user or a post");
        }


        return "Report created successfully!";
    }

}
