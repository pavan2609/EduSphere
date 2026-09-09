package com.edusphere.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.edusphere.backend.dto.ModuleRequestDto;
import com.edusphere.backend.dto.ModuleResponseDto;
import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.Module;
import com.edusphere.backend.repository.CourseRepository;
import com.edusphere.backend.repository.ModuleRepository;
import com.edusphere.backend.dto.ModuleReorderRequestDto;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;

    public ModuleService(
            ModuleRepository moduleRepository,
            CourseRepository courseRepository) {

        this.moduleRepository = moduleRepository;
        this.courseRepository = courseRepository;
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
    public ModuleResponseDto createModule(
            Long courseId,
            ModuleRequestDto request,
            String instructorEmail) {

        Course course = getCourseForInstructor(
                courseId,
                instructorEmail
        );

        Module module = new Module();

        module.setTitle(request.getTitle());
        module.setModuleOrder(request.getModuleOrder());
        module.setCourse(course);

        Module savedModule =
                moduleRepository.save(module);

        return convertToResponse(savedModule);
    }

    public List<ModuleResponseDto> getCourseModules(
            Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        return moduleRepository
                .findByCourseOrderByModuleOrderAsc(course)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private ModuleResponseDto convertToResponse(
            Module module) {

        return new ModuleResponseDto(
                module.getId(),
                module.getTitle(),
                module.getModuleOrder(),
                module.getCourse().getId()
        );
    }
    public ModuleResponseDto updateModule(
            Long moduleId,
            ModuleRequestDto request,
            String instructorEmail) {

        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() ->
                        new RuntimeException("Module not found"));

        if (!module.getCourse().getInstructor().getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to modify this module"
            );
        }

        module.setTitle(request.getTitle());
        module.setModuleOrder(request.getModuleOrder());

        return convertToResponse(
                moduleRepository.save(module)
        );
    }
    public void deleteModule(
            Long moduleId,
            String instructorEmail) {

        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() ->
                        new RuntimeException("Module not found"));

        if (!module.getCourse().getInstructor().getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to delete this module"
            );
        }

        moduleRepository.delete(module);
    }
    public ModuleResponseDto reorderModule(
            Long moduleId,
            ModuleReorderRequestDto request,
            String instructorEmail) {

        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() ->
                        new RuntimeException("Module not found"));

        if (!module.getCourse().getInstructor().getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to reorder this module"
            );
        }

        module.setModuleOrder(
                request.getModuleOrder()
        );

        return convertToResponse(
                moduleRepository.save(module)
        );
    }
}