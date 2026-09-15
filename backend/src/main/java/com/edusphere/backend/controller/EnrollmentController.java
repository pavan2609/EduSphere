package com.edusphere.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.edusphere.backend.dto.EnrollmentResponseDto;
import com.edusphere.backend.service.EnrollmentService;

@RestController
@RequestMapping("/api/student/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(
            EnrollmentService enrollmentService) {

        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/courses/{courseId}")
    public ResponseEntity<EnrollmentResponseDto> enroll(
            @PathVariable Long courseId,
            Authentication authentication) {

        EnrollmentResponseDto response =
                enrollmentService.enroll(
                        courseId,
                        authentication.getName());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<EnrollmentResponseDto>>
            getMyEnrollments(
                    Authentication authentication) {

        return ResponseEntity.ok(
                enrollmentService.getMyEnrollments(
                        authentication.getName()));
    }
}