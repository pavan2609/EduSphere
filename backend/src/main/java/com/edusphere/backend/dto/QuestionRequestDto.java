package com.edusphere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class QuestionRequestDto {

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotNull(message = "Question order is required")
    @Positive(message = "Question order must be greater than zero")
    private Integer questionOrder;

    public QuestionRequestDto() {
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public void setQuestionOrder(Integer questionOrder) {
        this.questionOrder = questionOrder;
    }
}