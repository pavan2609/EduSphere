package com.edusphere.backend.dto;

public class StudentQuizOptionResponseDto {

    private Long id;
    private String optionText;

    public StudentQuizOptionResponseDto() {
    }

    public StudentQuizOptionResponseDto(
            Long id,
            String optionText) {

        this.id = id;
        this.optionText = optionText;
    }

    public Long getId() {
        return id;
    }

    public String getOptionText() {
        return optionText;
    }
}