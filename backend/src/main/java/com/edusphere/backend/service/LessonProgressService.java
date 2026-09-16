package com.edusphere.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edusphere.backend.dto.CourseProgressResponseDto;
import com.edusphere.backend.dto.LessonProgressResponseDto;
import com.edusphere.backend.entity.Lesson;
import com.edusphere.backend.entity.LessonProgress;
import com.edusphere.backend.entity.LessonProgressStatus;
import com.edusphere.backend.entity.User;
import com.edusphere.backend.repository.LessonProgressRepository;
import com.edusphere.backend.repository.LessonRepository;
import com.edusphere.backend.repository.UserRepository;
import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.EnrollmentStatus;
import com.edusphere.backend.entity.Module;
import com.edusphere.backend.repository.CourseRepository;
import com.edusphere.backend.repository.EnrollmentRepository;

@Service
public class LessonProgressService {

    private final LessonProgressRepository progressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository lessonProgressRepository;

    public LessonProgressService(
            LessonProgressRepository progressRepository,
            LessonRepository lessonRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            LessonProgressRepository lessonProgressRepository) {

        this.progressRepository = progressRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonProgressRepository = lessonProgressRepository;
    }


    @Transactional
    public LessonProgressResponseDto completeLesson(
            Long lessonId,
            String studentEmail) {

        User student = userRepository
                .findByEmail(studentEmail)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Lesson lesson = lessonRepository
                .findById(lessonId)
                .orElseThrow(() ->
                        new RuntimeException("Lesson not found"));

        if (!"STUDENT".equals(student.getRole())) {
            throw new RuntimeException(
                    "Only students can update lesson progress");
        }
        Module module = lesson.getModule();

        Course course = module.getCourse();

        boolean enrolled =
                enrollmentRepository
                        .existsByStudentAndCourseAndStatus(
                                student,
                                course,
                                EnrollmentStatus.ENROLLED
                        );

        if (!enrolled) {
            throw new RuntimeException(
                    "Student is not enrolled in this course"
            );
        }
        LessonProgress progress =
                progressRepository
                        .findByStudentAndLesson(student, lesson)
                        .orElseGet(LessonProgress::new);

        progress.setStudent(student);
        progress.setLesson(lesson);
        progress.setStatus(
                LessonProgressStatus.COMPLETED);
        progress.setCompletedAt(LocalDateTime.now());

        LessonProgress saved =
                progressRepository.save(progress);

        return convertToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<LessonProgressResponseDto> getMyProgress(
            String studentEmail) {

        User student = userRepository
                .findByEmail(studentEmail)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        return progressRepository
                .findByStudent(student)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private LessonProgressResponseDto convertToResponse(
            LessonProgress progress) {

        return new LessonProgressResponseDto(
                progress.getId(),
                progress.getLesson().getId(),
                progress.getStatus().name(),
                progress.getCompletedAt()
        );
    }
    @Transactional(readOnly = true)
    public CourseProgressResponseDto getCourseProgress(
            Long courseId,
            String studentEmail) {

        User student = userRepository
                .findByEmail(studentEmail)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Course course = courseRepository
                .findByIdAndStatus(courseId, "PUBLISHED")
                .orElseThrow(() ->
                        new RuntimeException(
                                "Published course not found"));

        boolean enrolled =
                enrollmentRepository
                        .existsByStudentAndCourseAndStatus(
                                student,
                                course,
                                EnrollmentStatus.ENROLLED
                        );

        if (!enrolled) {
            throw new RuntimeException(
                    "Student is not enrolled in this course"
            );
        }

        List<Lesson> lessons = lessonRepository.findByCourse(course);

        int totalLessons = lessons.size();

     

        long completedLessons =
                lessonProgressRepository.countByStudentAndLessonInAndStatus(
                        student,
                        lessons,
                        LessonProgressStatus.COMPLETED
                );

        double progressPercentage = totalLessons == 0
                ? 0.0
                : (completedLessons * 100.0) / totalLessons;

        return new CourseProgressResponseDto(
                course.getId(),
                course.getTitle(),
                "ENROLLED",
                totalLessons,
                completedLessons,
                Math.round(progressPercentage * 100.0) / 100.0
        );
    }
}