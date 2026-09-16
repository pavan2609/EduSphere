package com.edusphere.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuizAttemptStartResponseDto {

    private Long attemptId;
    private Long quizId;
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
            String title,
            String description,
            Integer durationMinutes,
            Double passPercentage,
            LocalDateTime startedAt,
            LocalDateTime expiresAt,
            List<StudentQuizQuestionResponseDto> questions
    ) {
        this.attemptId = attemptId;
        this.quizId = quizId;
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

    public Long getQuizId() {
        return quizId;
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

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public List<StudentQuizQuestionResponseDto> getQuestions() {
        return questions;
    }
}