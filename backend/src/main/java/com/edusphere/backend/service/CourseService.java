package com.edusphere.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.edusphere.backend.dto.CourseRequestDto;
import com.edusphere.backend.dto.CourseResponseDto;
import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.User;
import com.edusphere.backend.repository.CourseRepository;
import com.edusphere.backend.repository.UserRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseService(
            CourseRepository courseRepository,
            UserRepository userRepository) {

        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public CourseResponseDto createCourse(
            CourseRequestDto request,
            String instructorEmail) {

        User instructor = userRepository
                .findByEmail(instructorEmail)
                .orElseThrow(() ->
                        new RuntimeException("Instructor not found"));

        Course course = new Course();

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setStatus("DRAFT");
        course.setInstructor(instructor);

        Course savedCourse = courseRepository.save(course);

        return convertToResponse(savedCourse);
    }

    public List<CourseResponseDto> getInstructorCourses(
            String instructorEmail) {

        User instructor = userRepository
                .findByEmail(instructorEmail)
                .orElseThrow(() ->
                        new RuntimeException("Instructor not found"));

        return courseRepository
                .findByInstructor(instructor)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private CourseResponseDto convertToResponse(Course course) {

        return new CourseResponseDto(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getStatus(),
                course.getInstructor().getId(),
                course.getInstructor().getName()
        );
    }
    private Course getCourseForInstructor(
            Long courseId,
            String instructorEmail) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        if (!course.getInstructor().getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to modify this course"
            );
        }

        return course;
    }
    public CourseResponseDto updateCourse(
            Long courseId,
            CourseRequestDto request,
            String instructorEmail) {

        Course course = getCourseForInstructor(
                courseId,
                instructorEmail
        );

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());

        Course updatedCourse =
                courseRepository.save(course);

        return convertToResponse(updatedCourse);
    }
    
    public void deleteCourse(
            Long courseId,
            String instructorEmail) {

        Course course = getCourseForInstructor(
                courseId,
                instructorEmail
        );

        courseRepository.delete(course);
    }
    public CourseResponseDto publishCourse(
            Long courseId,
            String instructorEmail) {

        Course course = getCourseForInstructor(
                courseId,
                instructorEmail
        );

        course.setStatus("PUBLISHED");

        return convertToResponse(
                courseRepository.save(course)
        );
    }
    public CourseResponseDto unpublishCourse(
            Long courseId,
            String instructorEmail) {

        Course course = getCourseForInstructor(
                courseId,
                instructorEmail
        );

        course.setStatus("DRAFT");

        return convertToResponse(
                courseRepository.save(course)
        );
    }
}