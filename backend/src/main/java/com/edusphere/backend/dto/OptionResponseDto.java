package com.edusphere.backend.dto;

public class OptionResponseDto {

    private Long id;
    private Long questionId;
    private String optionText;
    private Boolean correct;

    public OptionResponseDto() {
    }

    public OptionResponseDto(
            Long id,
            Long questionId,
            String optionText,
            Boolean correct) {

        this.id = id;
        this.questionId = questionId;
        this.optionText = optionText;
        this.correct = correct;
    }

    public Long getId() {
        return id;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public String getOptionText() {
        return optionText;
    }

    public Boolean getCorrect() {
        return correct;
    }
}