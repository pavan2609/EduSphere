package com.edusphere.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.edusphere.backend.dto.LessonRequestDto;
import com.edusphere.backend.dto.LessonResponseDto;
import com.edusphere.backend.entity.Lesson;
import com.edusphere.backend.entity.Module;
import com.edusphere.backend.repository.LessonRepository;
import com.edusphere.backend.repository.ModuleRepository;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;

    public LessonService(
            LessonRepository lessonRepository,
            ModuleRepository moduleRepository) {

        this.lessonRepository = lessonRepository;
        this.moduleRepository = moduleRepository;
    }

    public LessonResponseDto createLesson(
            Long moduleId,
            LessonRequestDto request,
            String instructorEmail) {

        Module module =
                getModuleForInstructor(
                        moduleId,
                        instructorEmail
                );

        Lesson lesson = new Lesson();

        lesson.setTitle(request.getTitle());
        lesson.setContent(request.getContent());
        lesson.setLessonOrder(
                request.getLessonOrder()
        );
        lesson.setModule(module);

        Lesson savedLesson =
                lessonRepository.save(lesson);

        return convertToResponse(savedLesson);
    }

    public List<LessonResponseDto> getModuleLessons(
            Long moduleId,
            String instructorEmail) {

        Module module =
                getModuleForInstructor(
                        moduleId,
                        instructorEmail
                );

        return lessonRepository
                .findByModuleOrderByLessonOrderAsc(module)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    private Module getModuleForInstructor(
            Long moduleId,
            String instructorEmail) {

        Module module = moduleRepository
                .findById(moduleId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Module not found"
                        )
                );

        if (!module.getCourse()
                .getInstructor()
                .getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to modify this module"
            );
        }

        return module;
    }

    private LessonResponseDto convertToResponse(
            Lesson lesson) {

        return new LessonResponseDto(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getContent(),
                lesson.getLessonOrder(),
                lesson.getModule().getId()
        );
    }
    private Lesson getLessonForInstructor(
            Long lessonId,
            String instructorEmail) {

        Lesson lesson = lessonRepository
                .findById(lessonId)
                .orElseThrow(() ->
                        new RuntimeException("Lesson not found")
                );

        if (!lesson.getModule()
                .getCourse()
                .getInstructor()
                .getEmail()
                .equals(instructorEmail)) {

            throw new RuntimeException(
                    "You are not authorized to modify this lesson"
            );
        }

        return lesson;
    }
    public LessonResponseDto updateLesson(
            Long lessonId,
            LessonRequestDto request,
            String instructorEmail) {

        Lesson lesson = getLessonForInstructor(
                lessonId,
                instructorEmail
        );

        lesson.setTitle(request.getTitle());
        lesson.setContent(request.getContent());
        lesson.setLessonOrder(request.getLessonOrder());

        return convertToResponse(
                lessonRepository.save(lesson)
        );
    }
    public void deleteLesson(
            Long lessonId,
            String instructorEmail) {

        Lesson lesson = getLessonForInstructor(
                lessonId,
                instructorEmail
        );

        lessonRepository.delete(lesson);
    }
    public LessonResponseDto reorderLesson(
            Long lessonId,
            Integer lessonOrder,
            String instructorEmail) {

        Lesson lesson = getLessonForInstructor(
                lessonId,
                instructorEmail
        );

        lesson.setLessonOrder(lessonOrder);

        return convertToResponse(
                lessonRepository.save(lesson)
        );
    }
}