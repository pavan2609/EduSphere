import api from "../api/axios";

export interface StudentLessonFile {
  id: number;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  lessonId: number;
}

export interface StudentLesson {
  id: number;
  title: string;
  content: string;
  lessonOrder: number;
  files: StudentLessonFile[];
}

export interface StudentModule {
  id: number;
  title: string;
  moduleOrder: number;
  lessons: StudentLesson[];
}

export interface StudentCourseDetails {
  id: number;
  title: string;
  description: string;
  status: string;
  instructorId: number;
  instructorName: string;
  modules: StudentModule[];
}

export const getStudentCourseDetails = async (
  courseId: number
): Promise<StudentCourseDetails> => {
  const response = await api.get(
    `/api/student/courses/${courseId}`
  );

  return response.data;
};

export interface LessonProgress {
  id: number;
  lessonId: number;
  status: "NOT_STARTED" | "COMPLETED";
  completedAt: string | null;
}

export interface CourseProgress {
  courseId: number;
  courseTitle: string;
  status: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

export const completeLesson = async (
  lessonId: number
): Promise<LessonProgress> => {
  const response = await api.patch(
    `/api/student/progress/lessons/${lessonId}/complete`
  );

  return response.data;
};

export const getMyProgress = async (): Promise<LessonProgress[]> => {
  const response = await api.get("/api/student/progress");

  return response.data;
};

export const getCourseProgress = async (
  courseId: number
): Promise<CourseProgress> => {
  const response = await api.get(
    `/api/student/progress/courses/${courseId}`
  );

  return response.data;
};
