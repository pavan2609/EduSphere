package com.edusphere.backend.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.edusphere.backend.dto.LessonReorderRequestDto;
import com.edusphere.backend.dto.LessonRequestDto;
import com.edusphere.backend.dto.LessonResponseDto;
import com.edusphere.backend.service.LessonService;

@RestController
@RequestMapping(
        "/api/instructor/modules/{moduleId}/lessons"
)
public class LessonController {

    private final LessonService lessonService;

    public LessonController(
            LessonService lessonService) {

        this.lessonService = lessonService;
    }

    @PostMapping
    public ResponseEntity<LessonResponseDto> createLesson(
            @PathVariable Long moduleId,
            @Valid @RequestBody LessonRequestDto request,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        LessonResponseDto response =
                lessonService.createLesson(
                        moduleId,
                        request,
                        instructorEmail
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<LessonResponseDto>> getLessons(
            @PathVariable Long moduleId,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        return ResponseEntity.ok(
                lessonService.getModuleLessons(
                        moduleId,
                        instructorEmail
                )
        );
    }
    @PutMapping("/{lessonId}")
    public ResponseEntity<LessonResponseDto> updateLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonRequestDto request,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        return ResponseEntity.ok(
                lessonService.updateLesson(
                        lessonId,
                        request,
                        instructorEmail
                )
        );
    }
    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long lessonId,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        lessonService.deleteLesson(
                lessonId,
                instructorEmail
        );

        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/{lessonId}/reorder")
    public ResponseEntity<LessonResponseDto> reorderLesson(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonReorderRequestDto request,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        return ResponseEntity.ok(
                lessonService.reorderLesson(
                        lessonId,
                        request.getLessonOrder(),
                        instructorEmail
                )
        );
    }
}