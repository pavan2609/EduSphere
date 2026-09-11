import api from "../api/axios";

export interface LessonRequest {
  title: string;
  content: string;
  lessonOrder: number;
}

export interface LessonResponse {
  id: number;
  title: string;
  content: string;
  lessonOrder: number;
  moduleId: number;
}

export interface LessonReorderRequest {
  lessonOrder: number;
}

export const createLesson = async (
  moduleId: number,
  data: LessonRequest
): Promise<LessonResponse> => {
  const response = await api.post(
    `/api/instructor/modules/${moduleId}/lessons`,
    data
  );

  return response.data;
};

export const getLessons = async (
  moduleId: number
): Promise<LessonResponse[]> => {
  const response = await api.get(
    `/api/instructor/modules/${moduleId}/lessons`
  );

  return response.data;
};

export const updateLesson = async (
  moduleId: number,
  lessonId: number,
  data: LessonRequest
): Promise<LessonResponse> => {
  const response = await api.put(
    `/api/instructor/modules/${moduleId}/lessons/${lessonId}`,
    data
  );

  return response.data;
};

export const deleteLesson = async (
  moduleId: number,
  lessonId: number
): Promise<void> => {
  await api.delete(
    `/api/instructor/modules/${moduleId}/lessons/${lessonId}`
  );
};

export const reorderLesson = async (
  moduleId: number,
  lessonId: number,
  data: LessonReorderRequest
): Promise<LessonResponse> => {
  const response = await api.patch(
    `/api/instructor/modules/${moduleId}/lessons/${lessonId}/reorder`,
    data
  );

  return response.data;
};