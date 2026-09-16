package com.edusphere.backend.dto;

import java.time.LocalDateTime;

public class LessonProgressResponseDto {

    private Long id;
    private Long lessonId;
    private String status;
    private LocalDateTime completedAt;

    public LessonProgressResponseDto() {
    }

    public LessonProgressResponseDto(
            Long id,
            Long lessonId,
            String status,
            LocalDateTime completedAt) {

        this.id = id;
        this.lessonId = lessonId;
        this.status = status;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}