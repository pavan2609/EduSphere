package com.edusphere.backend.dto;

import java.util.List;

public class StudentCourseDetailsResponseDto {

    private Long id;
    private String title;
    private String description;
    private String status;
    private Long instructorId;
    private String instructorName;
    private List<StudentModuleResponseDto> modules;

    public StudentCourseDetailsResponseDto() {
    }

    public StudentCourseDetailsResponseDto(
            Long id,
            String title,
            String description,
            String status,
            Long instructorId,
            String instructorName,
            List<StudentModuleResponseDto> modules) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.instructorId = instructorId;
        this.instructorName = instructorName;
        this.modules = modules;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }

    public List<StudentModuleResponseDto> getModules() {
        return modules;
    }

    public void setModules(List<StudentModuleResponseDto> modules) {
        this.modules = modules;
    }
}