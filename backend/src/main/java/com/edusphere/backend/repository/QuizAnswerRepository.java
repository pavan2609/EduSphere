package com.edusphere.backend.repository;

import com.edusphere.backend.entity.QuizAnswer;
import com.edusphere.backend.entity.QuizAttempt;
import com.edusphere.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizAnswerRepository extends JpaRepository<QuizAnswer, Long> {

    Optional<QuizAnswer> findByAttemptAndQuestion(
            QuizAttempt attempt,
            Question question
    );

    List<QuizAnswer> findByAttempt(QuizAttempt attempt);
}