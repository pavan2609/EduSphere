package com.edusphere.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.User;

public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByInstructor(User instructor);

    List<Course> findByStatus(String status);

    List<Course> findByTitleContainingIgnoreCase(String title);
}