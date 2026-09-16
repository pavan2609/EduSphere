package com.edusphere.backend.dto;

import jakarta.validation.constraints.NotNull;

public class QuizAnswerRequestDto {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    private Long selectedOptionId;

    public QuizAnswerRequestDto() {
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getSelectedOptionId() {
        return selectedOptionId;
    }

    public void setSelectedOptionId(Long selectedOptionId) {
        this.selectedOptionId = selectedOptionId;
    }
}