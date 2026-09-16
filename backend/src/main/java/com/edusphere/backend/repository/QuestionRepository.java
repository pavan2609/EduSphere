package com.edusphere.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Question;
import com.edusphere.backend.entity.Quiz;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByQuizOrderByQuestionOrderAsc(Quiz quiz);

    Optional<Question> findByIdAndQuiz(Long id, Quiz quiz);
}