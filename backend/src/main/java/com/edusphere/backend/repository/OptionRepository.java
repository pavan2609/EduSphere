package com.edusphere.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edusphere.backend.entity.Option;
import com.edusphere.backend.entity.Question;

public interface OptionRepository extends JpaRepository<Option, Long> {

    List<Option> findByQuestion(Question question);

    Optional<Option> findByIdAndQuestion(
            Long id,
            Question question
    );
}