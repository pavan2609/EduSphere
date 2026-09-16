package com.edusphere.backend.service;

import com.edusphere.backend.dto.QuizAnswerRequestDto;
import com.edusphere.backend.dto.QuizAttemptStartResponseDto;
import com.edusphere.backend.dto.QuizResultResponseDto;
import com.edusphere.backend.dto.QuizSubmitRequestDto;
import com.edusphere.backend.dto.StudentQuizQuestionResponseDto;
import com.edusphere.backend.dto.StudentQuizOptionResponseDto;
import com.edusphere.backend.entity.Course;
import com.edusphere.backend.entity.Enrollment;
import com.edusphere.backend.entity.EnrollmentStatus;
import com.edusphere.backend.entity.Option;
import com.edusphere.backend.entity.Question;
import com.edusphere.backend.entity.Quiz;
import com.edusphere.backend.entity.QuizAnswer;
import com.edusphere.backend.entity.QuizAttempt;
import com.edusphere.backend.entity.User;
import com.edusphere.backend.repository.EnrollmentRepository;
import com.edusphere.backend.repository.OptionRepository;
import com.edusphere.backend.repository.QuestionRepository;
import com.edusphere.backend.repository.QuizAnswerRepository;
import com.edusphere.backend.repository.QuizAttemptRepository;
import com.edusphere.backend.repository.QuizRepository;
import com.edusphere.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class QuizAttemptService {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizAnswerRepository quizAnswerRepository;

    public QuizAttemptService(
            UserRepository userRepository,
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            OptionRepository optionRepository,
            EnrollmentRepository enrollmentRepository,
            QuizAttemptRepository quizAttemptRepository,
            QuizAnswerRepository quizAnswerRepository
    ) {
        this.userRepository = userRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizAnswerRepository = quizAnswerRepository;
    }

    @Transactional
    public QuizAttemptStartResponseDto startQuiz(
            Long quizId,
            String email
    ) {
        User student = getUser(email);

        Quiz quiz = quizRepository.findByIdAndStatus(quizId, "PUBLISHED")
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Published quiz not found"
                        )
                );

        validateStudentEnrollment(student, quiz.getCourse());

        QuizAttempt existingAttempt =
                quizAttemptRepository
                        .findFirstByStudentAndQuizAndStatusOrderByStartedAtDesc(
                                student,
                                quiz,
                                "IN_PROGRESS"
                        )
                        .orElse(null);

        if (existingAttempt != null) {

            if (LocalDateTime.now().isAfter(existingAttempt.getExpiresAt())) {
                existingAttempt.setStatus("EXPIRED");
                quizAttemptRepository.save(existingAttempt);
            } else {
                return buildStartResponse(existingAttempt, quiz);
            }
        }

        LocalDateTime startedAt = LocalDateTime.now();

        LocalDateTime expiresAt =
                startedAt.plusMinutes(quiz.getDurationMinutes());

        QuizAttempt attempt = new QuizAttempt();

        attempt.setStudent(student);
        attempt.setQuiz(quiz);
        attempt.setStartedAt(startedAt);
        attempt.setExpiresAt(expiresAt);
        attempt.setStatus("IN_PROGRESS");

        QuizAttempt savedAttempt =
                quizAttemptRepository.save(attempt);

        return buildStartResponse(savedAttempt, quiz);
    }

    @Transactional
    public QuizResultResponseDto submitQuiz(
            Long attemptId,
            QuizSubmitRequestDto request,
            String email
    ) {
        User student = getUser(email);

        QuizAttempt attempt =
                quizAttemptRepository
                        .findByIdAndStudent(attemptId, student)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Quiz attempt not found"
                                )
                        );

        if (!"IN_PROGRESS".equals(attempt.getStatus())) {
            throw new IllegalArgumentException(
                    "Quiz attempt has already been completed"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        if (now.isAfter(attempt.getExpiresAt())) {
            attempt.setStatus("EXPIRED");
            quizAttemptRepository.save(attempt);

            throw new IllegalArgumentException(
                    "Quiz attempt has expired"
            );
        }

        Quiz quiz = attempt.getQuiz();

        List<Question> questions =
                questionRepository
                        .findByQuizOrderByQuestionOrderAsc(quiz);

        if (questions.isEmpty()) {
            throw new IllegalArgumentException(
                    "Quiz has no questions"
            );
        }

        int score = 0;

        List<QuizAnswer> answersToSave = new ArrayList<>();

        for (QuizAnswerRequestDto answerRequest : request.getAnswers()) {

            Question question =
                    questionRepository
                            .findByIdAndQuiz(
                                    answerRequest.getQuestionId(),
                                    quiz
                            )
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Invalid question in submission"
                                    )
                            );

            QuizAnswer quizAnswer =
                    quizAnswerRepository
                            .findByAttemptAndQuestion(
                                    attempt,
                                    question
                            )
                            .orElseGet(QuizAnswer::new);

            quizAnswer.setAttempt(attempt);
            quizAnswer.setQuestion(question);

            Long selectedOptionId =
                    answerRequest.getSelectedOptionId();

            if (selectedOptionId != null) {

                Option selectedOption =
                        optionRepository
                                .findByIdAndQuestion(
                                        selectedOptionId,
                                        question
                                )
                                .orElseThrow(() ->
                                        new IllegalArgumentException(
                                                "Invalid option for question"
                                        )
                                );

                quizAnswer.setSelectedOption(selectedOption);

                if (Boolean.TRUE.equals(
                        selectedOption.getCorrect()
                )) {
                    score++;
                }

            } else {
                quizAnswer.setSelectedOption(null);
            }

            answersToSave.add(quizAnswer);
        }

        quizAnswerRepository.saveAll(answersToSave);

        int totalQuestions = questions.size();

        double percentage =
                ((double) score / totalQuestions) * 100.0;

        percentage =
                Math.round(percentage * 100.0) / 100.0;

        boolean passed =
                percentage >= quiz.getPassPercentage();

        attempt.setSubmittedAt(now);
        attempt.setScore(score);
        attempt.setPercentage(percentage);
        attempt.setPassed(passed);
        attempt.setStatus("SUBMITTED");

        quizAttemptRepository.save(attempt);

        return new QuizResultResponseDto(
                attempt.getId(),
                quiz.getId(),
                quiz.getTitle(),
                score,
                totalQuestions,
                percentage,
                quiz.getPassPercentage(),
                passed,
                now,
                attempt.getStatus()
        );
    }

    private QuizAttemptStartResponseDto buildStartResponse(
            QuizAttempt attempt,
            Quiz quiz
    ) {
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

        return new QuizAttemptStartResponseDto(
                attempt.getId(),
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDescription(),
                quiz.getDurationMinutes(),
                quiz.getPassPercentage(),
                attempt.getStartedAt(),
                attempt.getExpiresAt(),
                questionDtos
        );
    }

    private void validateStudentEnrollment(
            User student,
            Course course
    ) {
        Enrollment enrollment =
                enrollmentRepository
                        .findByStudentAndCourse(student, course)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Student is not enrolled in this course"
                                )
                        );

        if (enrollment.getStatus() != EnrollmentStatus.ENROLLED) {
            throw new IllegalArgumentException(
                    "Student must be actively enrolled in the course"
            );
        }

        if (!"STUDENT".equalsIgnoreCase(student.getRole())) {
            throw new IllegalArgumentException(
                    "Only students can attempt quizzes"
            );
        }
    }

    private User getUser(String email) {
        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );
    }
    @Transactional(readOnly = true)
    public QuizResultResponseDto getAttemptResult(
            Long attemptId,
            String email
    ) {
        User student = getUser(email);

        QuizAttempt attempt =
                quizAttemptRepository
                        .findByIdAndStudent(attemptId, student)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Quiz attempt not found"
                                )
                        );

        if (!"SUBMITTED".equals(attempt.getStatus())) {
            throw new IllegalArgumentException(
                    "Quiz attempt has not been submitted yet"
            );
        }

        Quiz quiz = attempt.getQuiz();

        List<Question> questions =
                questionRepository
                        .findByQuizOrderByQuestionOrderAsc(quiz);

        return new QuizResultResponseDto(
                attempt.getId(),
                quiz.getId(),
                quiz.getTitle(),
                attempt.getScore(),
                questions.size(),
                attempt.getPercentage(),
                quiz.getPassPercentage(),
                attempt.getPassed(),
                attempt.getSubmittedAt(),
                attempt.getStatus()
        );
    }
}