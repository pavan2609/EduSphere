package com.edusphere.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Lesson;
import com.edusphere.backend.entity.Module;

public interface LessonRepository
        extends JpaRepository<Lesson, Long> {

    List<Lesson> findByModuleOrderByLessonOrderAsc(
            Module module
    );
}