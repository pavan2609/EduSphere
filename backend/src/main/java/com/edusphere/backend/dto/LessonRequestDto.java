package com.edusphere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class LessonRequestDto {

    @NotBlank(message = "Lesson title is required")
    @Size(
            min = 3,
            max = 150,
            message = "Lesson title must be between 3 and 150 characters"
    )
    private String title;

    @Size(
            max = 5000,
            message = "Lesson content cannot exceed 5000 characters"
    )
    private String content;

    @NotNull(message = "Lesson order is required")
    @Positive(message = "Lesson order must be greater than zero")
    private Integer lessonOrder;

    public LessonRequestDto() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getLessonOrder() {
        return lessonOrder;
    }

    public void setLessonOrder(Integer lessonOrder) {
        this.lessonOrder = lessonOrder;
    }
}