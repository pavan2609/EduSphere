package com.edusphere.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.edusphere.backend.dto.QuizRequestDto;
import com.edusphere.backend.dto.QuizResponseDto;
import com.edusphere.backend.dto.StudentQuizOptionResponseDto;
import com.edusphere.backend.dto.StudentQuizQuestionResponseDto;
import com.edusphere.backend.dto.StudentQuizResponseDto;
import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.Option;
import com.edusphere.backend.entity.Question;
import com.edusphere.backend.entity.Quiz;
import com.edusphere.backend.entity.User;
import com.edusphere.backend.repository.CourseRepository;
import com.edusphere.backend.repository.OptionRepository;
import com.edusphere.backend.repository.QuestionRepository;
import com.edusphere.backend.repository.QuizRepository;
import com.edusphere.backend.repository.UserRepository;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;

    public QuizService(
            QuizRepository quizRepository,
            CourseRepository courseRepository,
            UserRepository userRepository,
            QuestionRepository questionRepository,OptionRepository optionRepository) {

        this.quizRepository = quizRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
    }

    @Transactional
    public QuizResponseDto createQuiz(
            Long courseId,
            QuizRequestDto request,
            String email) {

        User instructor = getUser(email);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        validateInstructorOwnership(course, instructor);

        Quiz quiz = new Quiz();

        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setPassPercentage(request.getPassPercentage());
        quiz.setStatus("DRAFT");
        quiz.setCourse(course);

        Quiz savedQuiz = quizRepository.save(quiz);

        return convertToResponse(savedQuiz);
    }

    @Transactional(readOnly = true)
    public List<QuizResponseDto> getInstructorQuizzes(
            Long courseId,
            String email) {

        User instructor = getUser(email);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        validateInstructorOwnership(course, instructor);

        return quizRepository.findByCourse(course)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional
    public QuizResponseDto updateQuiz(
            Long quizId,
            QuizRequestDto request,
            String email) {

        User instructor = getUser(email);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() ->
                        new RuntimeException("Quiz not found"));

        validateInstructorOwnership(
                quiz.getCourse(),
                instructor
        );

        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setDurationMinutes(request.getDurationMinutes());
        quiz.setPassPercentage(request.getPassPercentage());

        Quiz updatedQuiz = quizRepository.save(quiz);

        return convertToResponse(updatedQuiz);
    }

    @Transactional
    public void deleteQuiz(
            Long quizId,
            String email) {

        User instructor = getUser(email);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() ->
                        new RuntimeException("Quiz not found"));

        validateInstructorOwnership(
                quiz.getCourse(),
                instructor
        );

        quizRepository.delete(quiz);
    }

    @Transactional
    public QuizResponseDto publishQuiz(
            Long quizId,
            String email) {

        User instructor = getUser(email);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() ->
                        new RuntimeException("Quiz not found"));

        validateInstructorOwnership(
                quiz.getCourse(),
                instructor
        );

        List<Question> questions =
                questionRepository
                        .findByQuizOrderByQuestionOrderAsc(quiz);

        if (questions.isEmpty()) {
            throw new IllegalArgumentException(
                    "Quiz must contain at least one question"
            );
        }

        for (Question question : questions) {

            List<Option> options =
                    optionRepository.findByQuestion(question);

            if (options.size() < 2) {
                throw new IllegalArgumentException(
                        "Each question must have at least 2 options"
                );
            }

            if (options.size() > 4) {
                throw new IllegalArgumentException(
                        "Each question can have a maximum of 4 options"
                );
            }

            long correctOptions = options.stream()
                    .filter(Option::getCorrect)
                    .count();

            if (correctOptions != 1) {
                throw new IllegalArgumentException(
                        "Each question must have exactly 1 correct option"
                );
            }
        }

        quiz.setStatus("PUBLISHED");

        return convertToResponse(
                quizRepository.save(quiz)
        );
    }

    @Transactional
    public QuizResponseDto unpublishQuiz(
            Long quizId,
            String email) {

        User instructor = getUser(email);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() ->
                        new RuntimeException("Quiz not found"));

        validateInstructorOwnership(
                quiz.getCourse(),
                instructor
        );

        quiz.setStatus("DRAFT");

        return convertToResponse(
                quizRepository.save(quiz)
        );
    }

    private User getUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }

    private void validateInstructorOwnership(
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

    private QuizResponseDto convertToResponse(Quiz quiz) {

        return new QuizResponseDto(
                quiz.getId(),
                quiz.getCourse().getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getDurationMinutes(),
                quiz.getPassPercentage(),
                quiz.getStatus()
        );
    }
    @Transactional(readOnly = true)
    public List<StudentQuizResponseDto> getPublishedQuizzesForStudent(
            Long courseId
    ) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Course not found"
                        )
                );

        if (!"PUBLISHED".equalsIgnoreCase(course.getStatus())) {
            throw new IllegalArgumentException(
                    "Course is not published"
            );
        }

        List<Quiz> quizzes =
                quizRepository.findByCourseAndStatus(
                        course,
                        "PUBLISHED"
                );

        List<StudentQuizResponseDto> response =
                new ArrayList<>();

        for (Quiz quiz : quizzes) {

            List<Question> questions =
                    questionRepository
                            .findByQuizOrderByQuestionOrderAsc(quiz);

            List<StudentQuizQuestionResponseDto> questionDtos =
                    new ArrayList<>();

            for (Question question : questions) {

                List<Option> options =
                        optionRepository.findByQuestion(question);

                List<StudentQuizOptionResponseDto> optionDtos =
                        new ArrayList<>();

                for (Option option : options) {

                    optionDtos.add(
                            new StudentQuizOptionResponseDto(
                                    option.getId(),
                                    option.getOptionText()
                            )
                    );
                }

                questionDtos.add(
                        new StudentQuizQuestionResponseDto(
                                question.getId(),
                                question.getQuestionText(),
                                question.getQuestionOrder(),
                                optionDtos
                        )
                );
            }

            response.add(
                    new StudentQuizResponseDto(
                            quiz.getId(),
                            course.getId(),
                            quiz.getTitle(),
                            quiz.getDescription(),
                            quiz.getDurationMinutes(),
                            quiz.getPassPercentage(),
                            questionDtos
                    )
            );
        }

        return response;
    }
}