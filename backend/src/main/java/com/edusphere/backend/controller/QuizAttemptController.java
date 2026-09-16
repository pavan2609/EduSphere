package com.edusphere.backend.controller;

import com.edusphere.backend.dto.QuizAttemptStartResponseDto;
import com.edusphere.backend.dto.QuizResultResponseDto;
import com.edusphere.backend.dto.QuizSubmitRequestDto;
import com.edusphere.backend.service.QuizAttemptService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;

    public QuizAttemptController(
            QuizAttemptService quizAttemptService
    ) {
        this.quizAttemptService = quizAttemptService;
    }

    @PostMapping("/quizzes/{quizId}/start")
    public ResponseEntity<QuizAttemptStartResponseDto> startQuiz(
            @PathVariable Long quizId,
            Authentication authentication
    ) {
        QuizAttemptStartResponseDto response =
                quizAttemptService.startQuiz(
                        quizId,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/quiz-attempts/{attemptId}/submit")
    public ResponseEntity<QuizResultResponseDto> submitQuiz(
            @PathVariable Long attemptId,
            @Valid @RequestBody QuizSubmitRequestDto request,
            Authentication authentication
    ) {
        QuizResultResponseDto response =
                quizAttemptService.submitQuiz(
                        attemptId,
                        request,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
    @GetMapping("/quiz-attempts/{attemptId}/result")
    public ResponseEntity<QuizResultResponseDto> getAttemptResult(
            @PathVariable Long attemptId,
            Authentication authentication
    ) {
        QuizResultResponseDto response =
                quizAttemptService.getAttemptResult(
                        attemptId,
                        authentication.getName()
                );

        return ResponseEntity.ok(response);
    }
}