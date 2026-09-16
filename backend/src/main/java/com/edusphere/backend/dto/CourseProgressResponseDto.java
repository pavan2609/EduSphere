package com.edusphere.backend.dto;

public class CourseProgressResponseDto {

    private Long courseId;
    private String courseTitle;
    private String status;
    private int totalLessons;
    private long completedLessons;
    private double progressPercentage;

    public CourseProgressResponseDto(
            Long courseId,
            String courseTitle,
            String status,
            int totalLessons,
            long completedLessons,
            double progressPercentage) {

        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.status = status;
        this.totalLessons = totalLessons;
        this.completedLessons = completedLessons;
        this.progressPercentage = progressPercentage;
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

    public int getTotalLessons() {
        return totalLessons;
    }

    public long getCompletedLessons() {
        return completedLessons;
    }

    public double getProgressPercentage() {
        return progressPercentage;
    }
}