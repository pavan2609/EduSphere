package com.edusphere.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.edusphere.backend.dto.CourseRequestDto;
import com.edusphere.backend.dto.CourseResponseDto;
import com.edusphere.backend.service.CourseService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/instructor/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<CourseResponseDto> createCourse(
    		@Valid @RequestBody CourseRequestDto request,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        CourseResponseDto response =
                courseService.createCourse(
                        request,
                        instructorEmail);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<CourseResponseDto>> getMyCourses(
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        return ResponseEntity.ok(
                courseService.getInstructorCourses(
                        instructorEmail)
        );
    }
    @PutMapping("/{courseId}")
    public ResponseEntity<CourseResponseDto> updateCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody CourseRequestDto request,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        return ResponseEntity.ok(
                courseService.updateCourse(
                        courseId,
                        request,
                        instructorEmail
                )
        );
    }
    @DeleteMapping("/{courseId}")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable Long courseId,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        courseService.deleteCourse(
                courseId,
                instructorEmail
        );

        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/{courseId}/publish")
    public ResponseEntity<CourseResponseDto> publishCourse(
            @PathVariable Long courseId,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        return ResponseEntity.ok(
                courseService.publishCourse(
                        courseId,
                        instructorEmail
                )
        );
    }
    @PatchMapping("/{courseId}/unpublish")
    public ResponseEntity<CourseResponseDto> unpublishCourse(
            @PathVariable Long courseId,
            Authentication authentication) {

        String instructorEmail =
                authentication.getName();

        return ResponseEntity.ok(
                courseService.unpublishCourse(
                        courseId,
                        instructorEmail
                )
        );
    }
}