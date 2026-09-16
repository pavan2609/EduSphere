package com.edusphere.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.Lesson;
import com.edusphere.backend.entity.Module;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByModuleOrderByLessonOrderAsc(Module module);

    @Query("""
            SELECT l
            FROM Lesson l
            WHERE l.module.course = :course
            ORDER BY l.module.moduleOrder ASC, l.lessonOrder ASC
            """)
    List<Lesson> findByCourse(@Param("course") Course course);
}