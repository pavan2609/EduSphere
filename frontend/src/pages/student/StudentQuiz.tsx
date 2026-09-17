import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {

    startQuiz,
    submitQuiz,
    type QuizAnswerRequest,
    type QuizAttemptStartResponse,
    type QuizResultResponse,
} from "../../services/studentQuizService";

const StudentQuiz = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    const numericQuizId = Number(quizId);

    const [quiz, setQuiz] = useState<QuizAttemptStartResponse | null>(null);
    const [answers, setAnswers] = useState<Record<number, number | null>>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [remainingSeconds, setRemainingSeconds] = useState(0);

    const [result, setResult] = useState<QuizResultResponse | null>(null);
    const [courseId, setCourseId] = useState<number | null>(null);
    useEffect(() => {
        if (!quizId || Number.isNaN(numericQuizId)) {
            setError("Invalid quiz ID");
            setLoading(false);
            return;
        }

        loadQuiz();
    }, [quizId]);

    const loadQuiz = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await startQuiz(numericQuizId);

            setQuiz(response);
            setCourseId(response.courseId);

            const initialAnswers: Record<number, number | null> = {};

            response.questions.forEach((question) => {
                initialAnswers[question.id] = null;
            });

            setAnswers(initialAnswers);

            updateRemainingTime(response.expiresAt);
        } catch (err: any) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to start quiz"
            );
        } finally {
            setLoading(false);
        }
    };

    const updateRemainingTime = (expiresAt: string) => {
        const expiryTime = new Date(expiresAt).getTime();
        const currentTime = Date.now();

        const seconds = Math.max(
            0,
            Math.floor((expiryTime - currentTime) / 1000)
        );

        setRemainingSeconds(seconds);
    };

    useEffect(() => {
        if (!quiz || result) {
            return;
        }

        const timer = window.setInterval(() => {
            const expiryTime = new Date(quiz.expiresAt).getTime();
            const currentTime = Date.now();

            const seconds = Math.max(
                0,
                Math.floor((expiryTime - currentTime) / 1000)
            );

            setRemainingSeconds(seconds);

            if (seconds <= 0) {
                window.clearInterval(timer);
                handleSubmit();
            }
        }, 1000);

        return () => {
            window.clearInterval(timer);
        };
    }, [quiz, result]);

    const currentQuestion = useMemo(() => {
        if (!quiz) {
            return null;
        }

        return quiz.questions[currentQuestionIndex];
    }, [quiz, currentQuestionIndex]);

    const handleOptionSelect = (optionId: number) => {
        if (!currentQuestion || submitting) {
            return;
        }

        setAnswers((previous) => ({
            ...previous,
            [currentQuestion.id]: optionId,
        }));
    };

    const handleNext = () => {
        if (!quiz) {
            return;
        }

        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(
                (previous) => previous + 1
            );
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(
                (previous) => previous - 1
            );
        }
    };

    const handleSubmit = async () => {
        if (!quiz || submitting || result) {
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const submissionAnswers: QuizAnswerRequest[] =
                quiz.questions.map((question) => ({
                    questionId: question.id,
                    selectedOptionId:
                        answers[question.id] ?? null,
                }));

            const response = await submitQuiz(
                quiz.attemptId,
                {
                    answers: submissionAnswers,
                }
            );

            setResult(response);
        } catch (err: any) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to submit quiz"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remaining = seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remaining
        ).padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="student-quiz-page">
                <div className="student-quiz-card">
                    <p>Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="student-quiz-page">
                <div className="student-quiz-card quiz-result-card">
                    <h1>Quiz Result</h1>

                    <h2>{result.quizTitle}</h2>

                    <div className="quiz-result-score">
                        <strong>
                            {result.score} / {result.totalQuestions}
                        </strong>
                    </div>

                    <p>
                        Percentage:{" "}
                        <strong>{result.percentage}%</strong>
                    </p>

                    <p>
                        Passing Percentage:{" "}
                        <strong>{result.passPercentage}%</strong>
                    </p>

                    <p>
                        Result:{" "}
                        <strong>
                            {result.passed ? "Passed" : "Failed"}
                        </strong>
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            if (courseId) {
                                navigate(`/student/courses/${courseId}`);
                            }
                        }}
                    >
                        Back to Course
                    </button>
                </div>
            </div>
        );
    }

    if (!quiz || !currentQuestion) {
        return (
            <div className="student-quiz-page">
                <div className="student-quiz-card">
                    <p>{error || "Quiz not available."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-quiz-page">
            <div className="student-quiz-header">
                <div>
                    <h1>{quiz.title}</h1>

                    <p>
                        Question {currentQuestionIndex + 1} of{" "}
                        {quiz.questions.length}
                    </p>
                </div>

                <div
                    className={`quiz-timer ${remainingSeconds <= 60
                            ? "quiz-timer-warning"
                            : ""
                        }`}
                >
                    Time Remaining:{" "}
                    <strong>
                        {formatTime(remainingSeconds)}
                    </strong>
                </div>
            </div>

            {error && (
                <div className="student-quiz-error">
                    {error}
                </div>
            )}

            <div className="student-quiz-card">
                <div className="quiz-question-number">
                    Question {currentQuestionIndex + 1}
                </div>

                <h2>{currentQuestion.questionText}</h2>

                <div className="quiz-options">
                    {currentQuestion.options.map((option) => (
                        <label
                            key={option.id}
                            className={`quiz-option ${answers[currentQuestion.id] ===
                                    option.id
                                    ? "quiz-option-selected"
                                    : ""
                                }`}
                        >
                            <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                value={option.id}
                                checked={
                                    answers[currentQuestion.id] ===
                                    option.id
                                }
                                onChange={() =>
                                    handleOptionSelect(option.id)
                                }
                                disabled={submitting}
                            />

                            <span>{option.optionText}</span>
                        </label>
                    ))}
                </div>

                <div className="quiz-navigation">
                    <button
                        type="button"
                        onClick={handlePrevious}
                        disabled={
                            currentQuestionIndex === 0 ||
                            submitting
                        }
                    >
                        Previous
                    </button>

                    {currentQuestionIndex <
                        quiz.questions.length - 1 ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={submitting}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting
                                ? "Submitting..."
                                : "Submit Quiz"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentQuiz;