package com.edusphere.backend.dto;

import java.util.List;

public class StudentQuizResponseDto {

    private Long id;
    private Long courseId;
    private String title;
    private String description;
    private Integer durationMinutes;
    private Double passPercentage;
    private List<StudentQuizQuestionResponseDto> questions;

    public StudentQuizResponseDto() {
    }

    public StudentQuizResponseDto(
            Long id,
            Long courseId,
            String title,
            String description,
            Integer durationMinutes,
            Double passPercentage,
            List<StudentQuizQuestionResponseDto> questions) {

        this.id = id;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.passPercentage = passPercentage;
        this.questions = questions;
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

    public List<StudentQuizQuestionResponseDto> getQuestions() {
        return questions;
    }
}