package com.edusphere.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.Enrollment;
import com.edusphere.backend.entity.EnrollmentStatus;
import com.edusphere.backend.entity.User;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    Optional<Enrollment> findByStudentAndCourse(
            User student,
            Course course
    );

    List<Enrollment> findByStudent(User student);

    List<Enrollment> findByStudentAndStatus(
            User student,
            EnrollmentStatus status
    );

    List<Enrollment> findByCourseAndStatus(
            Course course,
            EnrollmentStatus status
    );

    long countByCourseAndStatus(
            Course course,
            EnrollmentStatus status
    );
    boolean existsByStudentAndCourseAndStatus(
            User student,
            Course course,
            EnrollmentStatus status
    );
}