package com._blog.demo.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.Post;
import com._blog.demo.entities.Report;
import com._blog.demo.entities.User;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
// Spring translates this to: SELECT * FROM reports WHERE reported_post_id IS NOT NULL;

    List<Report> findByReportedPostIsNotNull();

    // Spring translates this to: SELECT * FROM reports WHERE reported_post_id IS NULL;
    List<Report> findByReportedPostIsNull();
//boolean existsByReporterAndReported(user reporter, user reported);

    boolean existsByReporterAndReportedAndReportedPostIsNull(User reporter, User reported);

    boolean existsByReporterAndReportedAndReportedPost(User reporter, User reported, Post reportedPostId);
}
