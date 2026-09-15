package com.edusphere.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edusphere.backend.dto.EnrollmentResponseDto;
import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.Enrollment;
import com.edusphere.backend.entity.EnrollmentStatus;
import com.edusphere.backend.entity.User;
import com.edusphere.backend.repository.CourseRepository;
import com.edusphere.backend.repository.EnrollmentRepository;
import com.edusphere.backend.repository.UserRepository;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            CourseRepository courseRepository,
            UserRepository userRepository) {

        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public EnrollmentResponseDto enroll(
            Long courseId,
            String studentEmail) {

        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Course course = courseRepository
                .findByIdAndStatus(courseId, "PUBLISHED")
                .orElseThrow(() ->
                        new RuntimeException(
                                "Published course not found"));

        if (!"STUDENT".equals(student.getRole())) {
            throw new RuntimeException(
                    "Only students can enroll in courses");
        }

        if (enrollmentRepository
                .findByStudentAndCourse(student, course)
                .isPresent()) {

            throw new RuntimeException(
                    "Student is already enrolled or waitlisted");
        }

        long enrolledCount =
                enrollmentRepository.countByCourseAndStatus(
                        course,
                        EnrollmentStatus.ENROLLED);

        EnrollmentStatus status;

        if (enrolledCount < course.getMaxSeats()) {
            status = EnrollmentStatus.ENROLLED;
        } else {
            status = EnrollmentStatus.WAITLISTED;
        }

        Enrollment enrollment = new Enrollment();

        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setStatus(status);
        enrollment.setEnrolledAt(LocalDateTime.now());

        Enrollment saved =
                enrollmentRepository.save(enrollment);

        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponseDto> getMyEnrollments(
            String studentEmail) {

        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        return enrollmentRepository
                .findByStudent(student)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private EnrollmentResponseDto convertToResponse(
            Enrollment enrollment) {

        return new EnrollmentResponseDto(
                enrollment.getId(),
                enrollment.getCourse().getId(),
                enrollment.getCourse().getTitle(),
                enrollment.getStatus().name(),
                enrollment.getEnrolledAt()
        );
    }
}