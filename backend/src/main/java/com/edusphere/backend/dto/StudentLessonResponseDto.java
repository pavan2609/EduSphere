package com.edusphere.backend.dto;

import java.util.List;

public class StudentLessonResponseDto {

    private Long id;
    private String title;
    private String content;
    private Integer lessonOrder;
    private List<LessonFileResponseDto> files;

    public StudentLessonResponseDto() {
    }

    public StudentLessonResponseDto(
            Long id,
            String title,
            String content,
            Integer lessonOrder,
            List<LessonFileResponseDto> files) {

        this.id = id;
        this.title = title;
        this.content = content;
        this.lessonOrder = lessonOrder;
        this.files = files;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<LessonFileResponseDto> getFiles() {
        return files;
    }

    public void setFiles(List<LessonFileResponseDto> files) {
        this.files = files;
    }
}