package com.edusphere.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.User;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByInstructor(User instructor);

    List<Course> findByStatus(String status);

    List<Course> findByTitleContainingIgnoreCase(String title);

    Page<Course> findByStatus(String status, Pageable pageable);

    Page<Course> findByStatusAndTitleContainingIgnoreCase(
            String status,
            String title,
            Pageable pageable
    );
    Optional<Course> findByIdAndStatus(Long id, String status);
}