package com.edusphere.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuizAttemptStartResponseDto {

    private Long attemptId;
    private Long quizId;
    private Long courseId;
    private String title;
    private String description;
    private Integer durationMinutes;
    private Double passPercentage;
    private LocalDateTime startedAt;
    private LocalDateTime expiresAt;
    private List<StudentQuizQuestionResponseDto> questions;

    public QuizAttemptStartResponseDto(
            Long attemptId,
            Long quizId,
            Long courseId,
            String title,
            String description,
            Integer durationMinutes,
            Double passPercentage,
            LocalDateTime startedAt,
            LocalDateTime expiresAt,
            List<StudentQuizQuestionResponseDto> questions) {

        this.attemptId = attemptId;
        this.quizId = quizId;
        this.courseId = courseId;
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.passPercentage = passPercentage;
        this.startedAt = startedAt;
        this.expiresAt = expiresAt;
        this.questions = questions;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Double getPassPercentage() {
        return passPercentage;
    }

    public void setPassPercentage(Double passPercentage) {
        this.passPercentage = passPercentage;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public List<StudentQuizQuestionResponseDto> getQuestions() {
        return questions;
    }

    public void setQuestions(
            List<StudentQuizQuestionResponseDto> questions) {
        this.questions = questions;
    }
}