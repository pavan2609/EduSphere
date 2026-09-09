package com.edusphere.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.Module;

public interface ModuleRepository extends JpaRepository<Module, Long> {

    List<Module> findByCourseOrderByModuleOrderAsc(Course course);
}