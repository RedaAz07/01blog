package com._blog.demo.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com._blog.demo.entities.Post;
import com._blog.demo.entities.Report;
import com._blog.demo.entities.User;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    // Spring translates this to: SELECT * FROM reports WHERE reported_post_id IS
    // NOT NULL;

    @Override
    Page<Report> findAll(Pageable pageable);

    Page<Report> findByStatus(boolean status, Pageable pageable);

    Page<Report> findByReportedPostIsNotNull(Pageable pageable);

    // Spring translates this to: SELECT * FROM reports WHERE reported_post_id IS
    // NULL;
    Page<Report> findByReportedPostIsNull(Pageable pageable);
    // boolean existsByReporterAndReported(user reporter, user reported);

    boolean existsByReporterAndReportedAndReportedPostIsNull(User reporter, User reported);

    boolean existsByReporterAndReportedAndReportedPost(User reporter, User reported, Post reportedPostId);

    @Query(value = """
            select count(*) as c , u.username  , u.first_name  , u.last_name , u.status
            from users AS u inner join reports As r ON
            u.id = r.reported_user_id GROUP BY u.id
            ORDER BY c DESC limit 5
            """, nativeQuery = true)
    List<Object[]> findTop5Reports();

}
