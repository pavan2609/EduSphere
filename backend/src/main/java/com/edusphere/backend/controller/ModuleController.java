package com.edusphere.backend.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.edusphere.backend.dto.ModuleReorderRequestDto;
import com.edusphere.backend.dto.ModuleRequestDto;
import com.edusphere.backend.dto.ModuleResponseDto;
import com.edusphere.backend.service.ModuleService;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/instructor/courses/{courseId}/modules")
public class ModuleController {

    private final ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @PostMapping
    public ResponseEntity<ModuleResponseDto> createModule(
            @PathVariable Long courseId,
            @Valid @RequestBody ModuleRequestDto request,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        ModuleResponseDto response =
                moduleService.createModule(
                        courseId,
                        request,
                        instructorEmail
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<ModuleResponseDto>> getModules(
            @PathVariable Long courseId) {

        return ResponseEntity.ok(
                moduleService.getCourseModules(courseId)
        );
    }
    @PutMapping("/{moduleId}")
    public ResponseEntity<ModuleResponseDto> updateModule(
            @PathVariable Long moduleId,
            @Valid @RequestBody ModuleRequestDto request,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        return ResponseEntity.ok(
                moduleService.updateModule(
                        moduleId,
                        request,
                        instructorEmail
                )
        );
    }
    @DeleteMapping("/{moduleId}")
    public ResponseEntity<Void> deleteModule(
            @PathVariable Long moduleId,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        moduleService.deleteModule(
                moduleId,
                instructorEmail
        );

        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/{moduleId}/reorder")
    public ResponseEntity<ModuleResponseDto> reorderModule(
            @PathVariable Long moduleId,
            @Valid @RequestBody ModuleReorderRequestDto request,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        return ResponseEntity.ok(
                moduleService.reorderModule(
                        moduleId,
                        request,
                        instructorEmail
                )
        );
    }
}