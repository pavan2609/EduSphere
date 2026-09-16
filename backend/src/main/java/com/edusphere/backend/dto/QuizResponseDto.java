package com.edusphere.backend.dto;

public class QuizResponseDto {

    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private Integer durationMinutes;
    private Double passPercentage;
    private String status;

    public QuizResponseDto() {
    }

    public QuizResponseDto(
            Long id,
            Long courseId,
            String title,
            String description,
            Integer durationMinutes,
            Double passPercentage,
            String status) {

        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.passPercentage = passPercentage;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public Double getPassPercentage() {
        return passPercentage;
    }

    public String getStatus() {
        return status;
    }
}