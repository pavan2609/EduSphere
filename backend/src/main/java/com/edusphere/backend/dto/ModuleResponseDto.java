package com.edusphere.backend.dto;

public class ModuleResponseDto {

    private Long id;
    private String title;
    private Integer moduleOrder;
    private Long courseId;

    public ModuleResponseDto() {
    }

    public ModuleResponseDto(
            Long id,
            String title,
            Integer moduleOrder,
            Long courseId) {

        this.id = id;
        this.title = title;
        this.moduleOrder = moduleOrder;
        this.courseId = courseId;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Integer getModuleOrder() {
        return moduleOrder;
    }

    public Long getCourseId() {
        return courseId;
    }
}