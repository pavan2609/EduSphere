package com.edusphere.backend.dto;

import java.util.List;

public class QuestionResponseDto {

    private Long id;
    private Long quizId;
    private String questionText;
    private Integer questionOrder;
    private List<OptionResponseDto> options;

    public QuestionResponseDto() {
    }

    public QuestionResponseDto(
            Long id,
            Long quizId,
            String questionText,
            Integer questionOrder,
            List<OptionResponseDto> options) {

        this.id = id;
        this.quizId = quizId;
        this.questionText = questionText;
        this.questionOrder = questionOrder;
        this.options = options;
    }

    public Long getId() {
        return id;
    }

    public Long getQuizId() {
        return quizId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public List<OptionResponseDto> getOptions() {
        return options;
    }
}