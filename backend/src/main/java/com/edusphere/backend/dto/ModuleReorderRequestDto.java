package com.edusphere.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ModuleReorderRequestDto {

    @NotNull(message = "Module order is required")
    @Positive(message = "Module order must be greater than zero")
    private Integer moduleOrder;

    public ModuleReorderRequestDto() {
    }

    public Integer getModuleOrder() {
        return moduleOrder;
    }

    public void setModuleOrder(Integer moduleOrder) {
        this.moduleOrder = moduleOrder;
    }
}