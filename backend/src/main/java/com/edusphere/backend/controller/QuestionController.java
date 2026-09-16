package com.edusphere.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.edusphere.backend.dto.OptionRequestDto;
import com.edusphere.backend.dto.OptionResponseDto;
import com.edusphere.backend.dto.QuestionRequestDto;
import com.edusphere.backend.dto.QuestionResponseDto;
import com.edusphere.backend.service.QuestionService;

@RestController
@RequestMapping("/api/instructor")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(
            QuestionService questionService) {

        this.questionService = questionService;
    }

    @PostMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<QuestionResponseDto> createQuestion(
            @PathVariable Long quizId,
            @Valid @RequestBody QuestionRequestDto request,
            Authentication authentication) {

        return ResponseEntity.status(201).body(
                questionService.createQuestion(
                        quizId,
                        request,
                        authentication.getName()
                )
        );
    }

    @GetMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<List<QuestionResponseDto>> getQuestions(
            @PathVariable Long quizId,
            Authentication authentication) {

        return ResponseEntity.ok(
                questionService.getQuestions(
                        quizId,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/questions/{questionId}")
    public ResponseEntity<QuestionResponseDto> updateQuestion(
            @PathVariable Long questionId,
            @Valid @RequestBody QuestionRequestDto request,
            Authentication authentication) {

        return ResponseEntity.ok(
                questionService.updateQuestion(
                        questionId,
                        request,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long questionId,
            Authentication authentication) {

        questionService.deleteQuestion(
                questionId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/questions/{questionId}/options")
    public ResponseEntity<OptionResponseDto> addOption(
            @PathVariable Long questionId,
            @Valid @RequestBody OptionRequestDto request,
            Authentication authentication) {

        return ResponseEntity.status(201).body(
                questionService.addOption(
                        questionId,
                        request,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/options/{optionId}")
    public ResponseEntity<OptionResponseDto> updateOption(
            @PathVariable Long optionId,
            @Valid @RequestBody OptionRequestDto request,
            Authentication authentication) {

        return ResponseEntity.ok(
                questionService.updateOption(
                        optionId,
                        request,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/options/{optionId}")
    public ResponseEntity<Void> deleteOption(
            @PathVariable Long optionId,
            Authentication authentication) {

        questionService.deleteOption(
                optionId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }
}