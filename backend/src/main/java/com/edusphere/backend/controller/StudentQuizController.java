package com.edusphere.backend.controller;

import com.edusphere.backend.dto.StudentQuizResponseDto;
import com.edusphere.backend.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentQuizController {

    private final QuizService quizService;

    public StudentQuizController(
            QuizService quizService
    ) {
        this.quizService = quizService;
    }

    @GetMapping("/courses/{courseId}/quizzes")
    public ResponseEntity<List<StudentQuizResponseDto>>
    getPublishedQuizzes(
            @PathVariable Long courseId
    ) {
        List<StudentQuizResponseDto> quizzes =
                quizService.getPublishedQuizzesForStudent(courseId);

        return ResponseEntity.ok(quizzes);
    }
}