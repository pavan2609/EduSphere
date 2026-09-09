package com.edusphere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CourseRequestDto {

    @NotBlank(message = "Course title is required")
    @Size(min = 3, max = 150, message = "Course title must be between 3 and 150 characters")
    private String title;

    @NotBlank(message = "Course description is required")
    @Size(min = 10, max = 2000, message = "Course description must be between 10 and 2000 characters")
    private String description;

    public CourseRequestDto() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}