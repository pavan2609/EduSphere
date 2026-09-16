package com.edusphere.backend.dto;

import java.util.List;

public class StudentQuizQuestionResponseDto {

    private Long id;
    private String questionText;
    private Integer questionOrder;
    private List<StudentQuizOptionResponseDto> options;

    public StudentQuizQuestionResponseDto() {
    }

    public StudentQuizQuestionResponseDto(
            Long id,
            String questionText,
            Integer questionOrder,
            List<StudentQuizOptionResponseDto> options) {

        this.id = id;
        this.questionText = questionText;
        this.questionOrder = questionOrder;
        this.options = options;
    }

    public Long getId() {
        return id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public List<StudentQuizOptionResponseDto> getOptions() {
        return options;
    }
}