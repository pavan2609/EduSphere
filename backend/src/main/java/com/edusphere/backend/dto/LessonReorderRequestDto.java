package com.edusphere.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class LessonReorderRequestDto {

    @NotNull(message = "Lesson order is required")
    @Positive(message = "Lesson order must be greater than zero")
    private Integer lessonOrder;

    public LessonReorderRequestDto() {
    }

    public Integer getLessonOrder() {
        return lessonOrder;
    }

    public void setLessonOrder(Integer lessonOrder) {
        this.lessonOrder = lessonOrder;
    }
}