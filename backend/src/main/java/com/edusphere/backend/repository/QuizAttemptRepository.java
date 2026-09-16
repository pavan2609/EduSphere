package com.edusphere.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Quiz;
import com.edusphere.backend.entity.QuizAttempt;
import com.edusphere.backend.entity.User;

public interface QuizAttemptRepository
        extends JpaRepository<QuizAttempt, Long> {

    Optional<QuizAttempt> findByIdAndStudent(
            Long id,
            User student
    );

    List<QuizAttempt> findByStudentAndQuizOrderByStartedAtDesc(
            User student,
            Quiz quiz
    );

    Optional<QuizAttempt> findFirstByStudentAndQuizAndStatusOrderByStartedAtDesc(
            User student,
            Quiz quiz,
            String status
    );
}