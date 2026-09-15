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