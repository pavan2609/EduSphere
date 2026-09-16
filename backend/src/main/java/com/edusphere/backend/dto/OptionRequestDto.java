package com.edusphere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class OptionRequestDto {

    @NotBlank(message = "Option text is required")
    private String optionText;

    @NotNull(message = "Correct flag is required")
    private Boolean correct;

    public OptionRequestDto() {
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }
}