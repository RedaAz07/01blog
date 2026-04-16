package com._blog.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.post;
import com._blog.demo.entities.report;
import com._blog.demo.entities.user;
@Repository
public interface  reportRepository extends  JpaRepository<report, Long> {

//boolean existsByReporterAndReported(user reporter, user reported);
boolean existsByReporterAndReportedAndReportedPostIsNull(user reporter, user reported);
boolean existsByReporterAndReportedAndReportedPost(user reporter, user reported, post reportedPostId);
}
