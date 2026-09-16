package com.edusphere.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.edusphere.backend.dto.CourseProgressResponseDto;
import com.edusphere.backend.dto.LessonProgressResponseDto;
import com.edusphere.backend.service.LessonProgressService;

@RestController
@RequestMapping("/api/student/progress")
public class LessonProgressController {

    private final LessonProgressService progressService;

    public LessonProgressController(
            LessonProgressService progressService) {

        this.progressService = progressService;
    }

    @PatchMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<LessonProgressResponseDto>
            completeLesson(
                    @PathVariable Long lessonId,
                    Authentication authentication) {

        return ResponseEntity.ok(
                progressService.completeLesson(
                        lessonId,
                        authentication.getName()
                )
        );
    }

    @GetMapping
    public ResponseEntity<List<LessonProgressResponseDto>>
            getMyProgress(
                    Authentication authentication) {

        return ResponseEntity.ok(
                progressService.getMyProgress(
                        authentication.getName()
                )
        );
    }
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<CourseProgressResponseDto> getCourseProgress(
            @PathVariable Long courseId,
            Authentication authentication) {

        return ResponseEntity.ok(
                progressService.getCourseProgress(
                        courseId,
                        authentication.getName()
                )
        );
    }
}