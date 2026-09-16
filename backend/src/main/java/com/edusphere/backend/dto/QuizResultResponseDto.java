package com.edusphere.backend.dto;

import java.time.LocalDateTime;

public class QuizResultResponseDto {

    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private Integer score;
    private Integer totalQuestions;
    private Double percentage;
    private Double passPercentage;
    private Boolean passed;
    private LocalDateTime submittedAt;
    private String status;

    public QuizResultResponseDto(
            Long attemptId,
            Long quizId,
            String quizTitle,
            Integer score,
            Integer totalQuestions,
            Double percentage,
            Double passPercentage,
            Boolean passed,
            LocalDateTime submittedAt,
            String status
    ) {
        this.attemptId = attemptId;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.percentage = percentage;
        this.passPercentage = passPercentage;
        this.passed = passed;
        this.submittedAt = submittedAt;
        this.status = status;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public Long getQuizId() {
        return quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public Integer getScore() {
        return score;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public Double getPercentage() {
        return percentage;
    }

    public Double getPassPercentage() {
        return passPercentage;
    }

    public Boolean getPassed() {
        return passed;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public String getStatus() {
        return status;
    }
}