package com.edusphere.backend.dto;

import java.time.LocalDateTime;

public class EnrollmentResponseDto {

    private Long id;
    private Long courseId;
    private String courseTitle;
    private String status;
    private LocalDateTime enrolledAt;

    public EnrollmentResponseDto() {
    }

    public EnrollmentResponseDto(
            Long id,
            Long courseId,
            String courseTitle,
            String status,
            LocalDateTime enrolledAt) {

        this.id = id;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.status = status;
        this.enrolledAt = enrolledAt;
    }

    public Long getId() {
        return id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }
}