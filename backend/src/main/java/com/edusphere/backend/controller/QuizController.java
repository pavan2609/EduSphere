package com.edusphere.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.edusphere.backend.dto.QuizRequestDto;
import com.edusphere.backend.dto.QuizResponseDto;
import com.edusphere.backend.service.QuizService;

@RestController
@RequestMapping("/api/instructor")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/courses/{courseId}/quizzes")
    public ResponseEntity<QuizResponseDto> createQuiz(
            @PathVariable Long courseId,
            @Valid @RequestBody QuizRequestDto request,
            Authentication authentication) {

        QuizResponseDto quiz =
                quizService.createQuiz(
                        courseId,
                        request,
                        authentication.getName()
                );

        return ResponseEntity.status(201).body(quiz);
    }

    @GetMapping("/courses/{courseId}/quizzes")
    public ResponseEntity<List<QuizResponseDto>> getQuizzes(
            @PathVariable Long courseId,
            Authentication authentication) {

        return ResponseEntity.ok(
                quizService.getInstructorQuizzes(
                        courseId,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/quizzes/{quizId}")
    public ResponseEntity<QuizResponseDto> updateQuiz(
            @PathVariable Long quizId,
            @Valid @RequestBody QuizRequestDto request,
            Authentication authentication) {

        return ResponseEntity.ok(
                quizService.updateQuiz(
                        quizId,
                        request,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/quizzes/{quizId}")
    public ResponseEntity<Void> deleteQuiz(
            @PathVariable Long quizId,
            Authentication authentication) {

        quizService.deleteQuiz(
                quizId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/quizzes/{quizId}/publish")
    public ResponseEntity<QuizResponseDto> publishQuiz(
            @PathVariable Long quizId,
            Authentication authentication) {

        return ResponseEntity.ok(
                quizService.publishQuiz(
                        quizId,
                        authentication.getName()
                )
        );
    }

    @PatchMapping("/quizzes/{quizId}/unpublish")
    public ResponseEntity<QuizResponseDto> unpublishQuiz(
            @PathVariable Long quizId,
            Authentication authentication) {

        return ResponseEntity.ok(
                quizService.unpublishQuiz(
                        quizId,
                        authentication.getName()
                )
        );
    }
}