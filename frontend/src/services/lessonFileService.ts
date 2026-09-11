import api from "../api/axios";

export interface LessonFileResponse {
  id: number;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  lessonId: number;
}

export const uploadLessonFile = async (
  lessonId: number,
  file: File
): Promise<LessonFileResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/api/instructor/lessons/${lessonId}/files`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getLessonFiles = async (
  lessonId: number
): Promise<LessonFileResponse[]> => {
  const response = await api.get(
    `/api/instructor/lessons/${lessonId}/files`
  );

  return response.data;
};

export const deleteLessonFile = async (
  fileId: number
): Promise<void> => {
  await api.delete(
    `/api/instructor/lessons/files/${fileId}`
  );
};

export const getLessonFileDownloadUrl = (
  fileId: number
): string => {
  return `http://localhost:8080/api/instructor/lessons/files/${fileId}/download`;
};