package com.edusphere.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class QuizSubmitRequestDto {

    @NotNull(message = "Answers are required")
    @Valid
    private List<QuizAnswerRequestDto> answers;

    public QuizSubmitRequestDto() {
    }

    public List<QuizAnswerRequestDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuizAnswerRequestDto> answers) {
        this.answers = answers;
    }
}