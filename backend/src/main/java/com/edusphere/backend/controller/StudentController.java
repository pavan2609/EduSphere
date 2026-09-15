package com.edusphere.backend.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.edusphere.backend.dto.CourseResponseDto;
import com.edusphere.backend.dto.StudentCourseDetailsResponseDto;
import com.edusphere.backend.service.CourseService;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final CourseService courseService;

    public StudentController(CourseService courseService) {
        this.courseService = courseService;
    }

    // =========================
    // Student Dashboard
    // =========================

    @GetMapping("/dashboard")
    public String studentDashboard() {
        return "Welcome to Student Dashboard";
    }

    // =========================
    // Student Course Catalog
    // =========================

    @GetMapping("/courses")
    public ResponseEntity<Page<CourseResponseDto>> getCourses(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "6")
            int size,

            @RequestParam(defaultValue = "")
            String search,

            @RequestParam(defaultValue = "title")
            String sortBy,

            @RequestParam(defaultValue = "asc")
            String direction,

            Authentication authentication) {

        Page<CourseResponseDto> courses =
                courseService.getPublishedCourses(
                        page,
                        size,
                        search,
                        sortBy,
                        direction
                );

        return ResponseEntity.ok(courses);
    }
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<StudentCourseDetailsResponseDto> getCourseDetails(
            @PathVariable Long courseId) {

        StudentCourseDetailsResponseDto course =
                courseService.getPublishedCourseDetails(courseId);

        return ResponseEntity.ok(course);
    }
}
