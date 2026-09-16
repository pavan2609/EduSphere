package com.edusphere.backend.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edusphere.backend.dto.OptionRequestDto;
import com.edusphere.backend.dto.OptionResponseDto;
import com.edusphere.backend.dto.QuestionRequestDto;
import com.edusphere.backend.dto.QuestionResponseDto;
import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.Option;
import com.edusphere.backend.entity.Question;
import com.edusphere.backend.entity.Quiz;
import com.edusphere.backend.entity.User;
import com.edusphere.backend.repository.OptionRepository;
import com.edusphere.backend.repository.QuestionRepository;
import com.edusphere.backend.repository.QuizRepository;
import com.edusphere.backend.repository.UserRepository;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    public QuestionService(
            QuestionRepository questionRepository,
            OptionRepository optionRepository,
            QuizRepository quizRepository,
            UserRepository userRepository) {

        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public QuestionResponseDto createQuestion(
            Long quizId,
            QuestionRequestDto request,
            String email) {

        User instructor = getUser(email);

        Quiz quiz = getQuiz(quizId);

        validateOwnership(quiz.getCourse(), instructor);

        Question question = new Question();

        question.setQuestionText(request.getQuestionText());
        question.setQuestionOrder(request.getQuestionOrder());
        question.setQuiz(quiz);

        Question savedQuestion =
                questionRepository.save(question);

        return convertToResponse(savedQuestion);
    }

    @Transactional(readOnly = true)
    public List<QuestionResponseDto> getQuestions(
            Long quizId,
            String email) {

        User instructor = getUser(email);

        Quiz quiz = getQuiz(quizId);

        validateOwnership(quiz.getCourse(), instructor);

        return questionRepository
                .findByQuizOrderByQuestionOrderAsc(quiz)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional
    public QuestionResponseDto updateQuestion(
            Long questionId,
            QuestionRequestDto request,
            String email) {

        User instructor = getUser(email);

        Question question =
                questionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Question not found"));

        validateOwnership(
                question.getQuiz().getCourse(),
                instructor
        );

        question.setQuestionText(request.getQuestionText());
        question.setQuestionOrder(request.getQuestionOrder());

        return convertToResponse(
                questionRepository.save(question)
        );
    }

    @Transactional
    public void deleteQuestion(
            Long questionId,
            String email) {

        User instructor = getUser(email);

        Question question =
                questionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Question not found"));

        validateOwnership(
                question.getQuiz().getCourse(),
                instructor
        );

        List<Option> options =
                optionRepository.findByQuestion(question);

        optionRepository.deleteAll(options);

        questionRepository.delete(question);
    }

    @Transactional
    public OptionResponseDto addOption(
            Long questionId,
            OptionRequestDto request,
            String email) {

        User instructor = getUser(email);

        Question question =
                questionRepository.findById(questionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Question not found"));

        validateOwnership(
                question.getQuiz().getCourse(),
                instructor
        );

        Option option = new Option();

        option.setOptionText(request.getOptionText());
        option.setCorrect(request.getCorrect());
        option.setQuestion(question);

        Option savedOption =
                optionRepository.save(option);

        return convertOptionToResponse(savedOption);
    }

    @Transactional
    public OptionResponseDto updateOption(
            Long optionId,
            OptionRequestDto request,
            String email) {

        User instructor = getUser(email);

        Option option =
                optionRepository.findById(optionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Option not found"));

        validateOwnership(
                option.getQuestion().getQuiz().getCourse(),
                instructor
        );

        option.setOptionText(request.getOptionText());
        option.setCorrect(request.getCorrect());

        return convertOptionToResponse(
                optionRepository.save(option)
        );
    }

    @Transactional
    public void deleteOption(
            Long optionId,
            String email) {

        User instructor = getUser(email);

        Option option =
                optionRepository.findById(optionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Option not found"));

        validateOwnership(
                option.getQuestion().getQuiz().getCourse(),
                instructor
        );

        optionRepository.delete(option);
    }

    private Quiz getQuiz(Long quizId) {

        return quizRepository.findById(quizId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Quiz not found"));
    }

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));
    }

    private void validateOwnership(
            Course course,
            User instructor) {

        if (course.getInstructor() == null ||
                !course.getInstructor().getId()
                        .equals(instructor.getId())) {

            throw new AccessDeniedException(
                    "You do not have access to this course"
            );
        }
    }

    private QuestionResponseDto convertToResponse(
            Question question) {

        List<OptionResponseDto> options =
                optionRepository
                        .findByQuestion(question)
                        .stream()
                        .map(this::convertOptionToResponse)
                        .toList();

        return new QuestionResponseDto(
                question.getId(),
                question.getQuiz().getId(),
                question.getQuestionText(),
                question.getQuestionOrder(),
                options
        );
    }

    private OptionResponseDto convertOptionToResponse(
            Option option) {

        return new OptionResponseDto(
                option.getId(),
                option.getQuestion().getId(),
                option.getOptionText(),
                option.getCorrect()
        );
    }
}