package com.edusphere.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Lesson;
import com.edusphere.backend.entity.LessonFile;
import java.util.Optional;

public interface LessonFileRepository
        extends JpaRepository<LessonFile, Long> {

    List<LessonFile> findByLesson(Lesson lesson);
    Optional<LessonFile> findByIdAndLesson(
            Long id,
            Lesson lesson
    );
}