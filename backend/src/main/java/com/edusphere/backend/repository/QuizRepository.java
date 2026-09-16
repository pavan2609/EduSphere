package com.edusphere.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByCourse(Course course);

    List<Quiz> findByCourseAndStatus(
            Course course,
            String status
    );

    Optional<Quiz> findByIdAndCourse(
            Long id,
            Course course
    );

    Optional<Quiz> findByIdAndStatus(
            Long id,
            String status
    );
}