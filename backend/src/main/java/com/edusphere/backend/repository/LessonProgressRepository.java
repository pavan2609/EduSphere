package com.edusphere.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Lesson;
import com.edusphere.backend.entity.LessonProgress;
import com.edusphere.backend.entity.LessonProgressStatus;
import com.edusphere.backend.entity.User;

public interface LessonProgressRepository
        extends JpaRepository<LessonProgress, Long> {

    Optional<LessonProgress> findByStudentAndLesson(
            User student,
            Lesson lesson
    );

    List<LessonProgress> findByStudent(User student);

    List<LessonProgress> findByStudentAndLessonIn(
            User student,
            List<Lesson> lessons
    );

    long countByStudentAndLessonInAndStatus(
            User student,
            List<Lesson> lessons,
            LessonProgressStatus status
    );
}