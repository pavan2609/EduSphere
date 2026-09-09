package com.edusphere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ModuleRequestDto {

    @NotBlank(message = "Module title is required")
    private String title;

    @NotNull(message = "Module order is required")
    @Positive(message = "Module order must be greater than zero")
    private Integer moduleOrder;

    public ModuleRequestDto() {
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
}