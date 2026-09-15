package com.edusphere.backend.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.edusphere.backend.dto.CourseRequestDto;
import com.edusphere.backend.dto.CourseResponseDto;
import com.edusphere.backend.dto.LessonFileResponseDto;
import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.User;
import com.edusphere.backend.repository.CourseRepository;
import com.edusphere.backend.repository.LessonFileRepository;
import com.edusphere.backend.repository.LessonRepository;
import com.edusphere.backend.repository.ModuleRepository;
import com.edusphere.backend.repository.UserRepository;
import com.edusphere.backend.dto.StudentCourseDetailsResponseDto;
import com.edusphere.backend.dto.StudentLessonResponseDto;
import com.edusphere.backend.dto.StudentModuleResponseDto;
import com.edusphere.backend.entity.Lesson;
import com.edusphere.backend.entity.LessonFile;
import com.edusphere.backend.entity.Module;
@Service
public class CourseService {

    private final CourseRepository courseRepository;

    private final UserRepository userRepository;

    private final ModuleRepository moduleRepository;
    
    private final LessonFileRepository lessonFileRepository;
    private final LessonRepository lessonRepository;
    public CourseService(
            CourseRepository courseRepository,
            UserRepository userRepository,ModuleRepository moduleRepository,LessonFileRepository lessonFileRepository, LessonRepository lessonRepository) {

        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.userRepository = userRepository;
        this.lessonFileRepository = lessonFileRepository;
        this.lessonRepository = lessonRepository;
    }

    // =========================
    // Create Course
    // =========================

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

        course.setMaxSeats(request.getMaxSeats());
        Course savedCourse = courseRepository.save(course);

        return convertToResponse(savedCourse);
    }

    // =========================
    // Get Instructor Courses
    // =========================

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

    // =========================
    // Student Course Catalog
    // =========================

    public Page<CourseResponseDto> getPublishedCourses(
            int page,
            int size,
            String search,
            String sortBy,
            String direction) {

        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page number cannot be negative");
        }

        if (size < 1 || size > 50) {
            throw new IllegalArgumentException(
                    "Page size must be between 1 and 50");
        }

        String normalizedSearch =
                search == null ? "" : search.trim();

        String normalizedSortBy =
                sortBy == null || sortBy.isBlank()
                        ? "title"
                        : sortBy;

        String normalizedDirection =
                direction == null || direction.isBlank()
                        ? "asc"
                        : direction;

        Sort.Direction sortDirection;

        if (normalizedDirection.equalsIgnoreCase("desc")) {
            sortDirection = Sort.Direction.DESC;
        } else {
            sortDirection = Sort.Direction.ASC;
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, normalizedSortBy)
        );

        Page<Course> courses;

        if (normalizedSearch.isEmpty()) {

            courses = courseRepository.findByStatus(
                    "PUBLISHED",
                    pageable
            );

        } else {

            courses =
                    courseRepository
                            .findByStatusAndTitleContainingIgnoreCase(
                                    "PUBLISHED",
                                    normalizedSearch,
                                    pageable
                            );
        }

        return courses.map(this::convertToResponse);
    }

    // =========================
    // Convert Entity to DTO
    // =========================

    private CourseResponseDto convertToResponse(
            Course course) {

        return new CourseResponseDto(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getStatus(),
                course.getInstructor().getId(),
                course.getInstructor().getName(),
                course.getMaxSeats()
        );
    }

    // =========================
    // Get Course For Instructor
    // =========================

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

    // =========================
    // Update Course
    // =========================

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
        course.setMaxSeats(request.getMaxSeats());

        Course updatedCourse =
                courseRepository.save(course);

        return convertToResponse(updatedCourse);
    }

    // =========================
    // Delete Course
    // =========================

    public void deleteCourse(
            Long courseId,
            String instructorEmail) {

        Course course = getCourseForInstructor(
                courseId,
                instructorEmail
        );

        courseRepository.delete(course);
    }

    // =========================
    // Publish Course
    // =========================

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

    // =========================
    // Unpublish Course
    // =========================

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
    
    public StudentCourseDetailsResponseDto getPublishedCourseDetails(Long courseId) {

        Course course = courseRepository.findByIdAndStatus(courseId, "PUBLISHED")
                .orElseThrow(() ->
                        new RuntimeException("Published course not found"));

        List<StudentModuleResponseDto> modules =
                moduleRepository.findByCourseOrderByModuleOrderAsc(course)
                        .stream()
                        .map(this::convertModuleForStudent)
                        .toList();

        User instructor = course.getInstructor();

        return new StudentCourseDetailsResponseDto(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getStatus(),
                instructor.getId(),
                instructor.getName(),
                modules
        );
    }

    private StudentModuleResponseDto convertModuleForStudent(Module module) {

        List<StudentLessonResponseDto> lessons =
                lessonRepository.findByModuleOrderByLessonOrderAsc(module)
                        .stream()
                        .map(this::convertLessonForStudent)
                        .toList();

        return new StudentModuleResponseDto(
                module.getId(),
                module.getTitle(),
                module.getModuleOrder(),
                lessons
        );
    }

    private StudentLessonResponseDto convertLessonForStudent(Lesson lesson) {

        List<LessonFileResponseDto> files =
                lessonFileRepository.findByLesson(lesson)
                        .stream()
                        .map(this::convertFileForStudent)
                        .toList();

        return new StudentLessonResponseDto(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getContent(),
                lesson.getLessonOrder(),
                files
        );
    }

    private LessonFileResponseDto convertFileForStudent(LessonFile file) {

        return new LessonFileResponseDto(
                file.getId(),
                file.getOriginalFileName(),
                file.getFileType(),
                file.getFileSize(),
                file.getLesson().getId()
        );
    }
    
}
