import api from "../api/axios";

export interface StudentQuizOption {
  id: number;
  optionText: string;
}

export interface StudentQuizQuestion {
  id: number;
  questionText: string;
  questionOrder: number;
  options: StudentQuizOption[];
}

export interface QuizAttemptStartResponse {
  attemptId: number;
  quizId: number;
   courseId: number;
  title: string;
  description: string;
  durationMinutes: number;
  passPercentage: number;
  startedAt: string;
  expiresAt: string;
  questions: StudentQuizQuestion[];
}

export interface QuizAnswerRequest {
  questionId: number;
  selectedOptionId: number | null;
}

export interface QuizSubmitRequest {
  answers: QuizAnswerRequest[];
}

export interface QuizResultResponse {
  attemptId: number;
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passPercentage: number;
  passed: boolean;
  submittedAt: string;
  status: string;
}

export const startQuiz = async (
  quizId: number
): Promise<QuizAttemptStartResponse> => {
  const response = await api.post(
    `/api/student/quizzes/${quizId}/start`
  );

  return response.data;
};

export const submitQuiz = async (
  attemptId: number,
  request: QuizSubmitRequest
): Promise<QuizResultResponse> => {
  const response = await api.post(
    `/api/student/quiz-attempts/${attemptId}/submit`,
    request
  );

  return response.data;
};

export const getQuizResult = async (
  attemptId: number
): Promise<QuizResultResponse> => {
  const response = await api.get(
    `/api/student/quiz-attempts/${attemptId}/result`
  );

  return response.data;
};
export interface StudentQuizSummary {
  id: number;
  courseId: number;
  title: string;
  description: string;
  durationMinutes: number;
  passPercentage: number;
  questions: StudentQuizQuestion[];
}

export const getPublishedQuizzes = async (
  courseId: number
): Promise<StudentQuizSummary[]> => {
  const response = await api.get(
    `/api/student/courses/${courseId}/quizzes`
  );

  return response.data;
};