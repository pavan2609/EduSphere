package com.edusphere.backend.dto;

public class LessonResponseDto {

    private Long id;
    private String title;
    private String content;
    private Integer lessonOrder;
    private Long moduleId;

    public LessonResponseDto() {
    }

    public LessonResponseDto(
            Long id,
            String title,
            String content,
            Integer lessonOrder,
            Long moduleId) {

        this.id = id;
        this.title = title;
        this.content = content;
        this.lessonOrder = lessonOrder;
        this.moduleId = moduleId;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Integer getLessonOrder() {
        return lessonOrder;
    }

    public Long getModuleId() {
        return moduleId;
    }
}