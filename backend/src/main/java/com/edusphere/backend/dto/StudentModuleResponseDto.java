package com.edusphere.backend.dto;

import java.util.List;

public class StudentModuleResponseDto {

    private Long id;
    private String title;
    private Integer moduleOrder;
    private List<StudentLessonResponseDto> lessons;

    public StudentModuleResponseDto() {
    }

    public StudentModuleResponseDto(
            Long id,
            String title,
            Integer moduleOrder,
            List<StudentLessonResponseDto> lessons) {

        this.id = id;
        this.title = title;
        this.moduleOrder = moduleOrder;
        this.lessons = lessons;
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

    public Integer getModuleOrder() {
        return moduleOrder;
    }

    public void setModuleOrder(Integer moduleOrder) {
        this.moduleOrder = moduleOrder;
    }

    public List<StudentLessonResponseDto> getLessons() {
        return lessons;
    }

    public void setLessons(List<StudentLessonResponseDto> lessons) {
        this.lessons = lessons;
    }
}