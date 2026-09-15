import api from "../api/axios";

export interface CourseRequest {
  title: string;
  description: string;
    maxSeats: number;
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  status: string;
  instructorId: number;
  instructorName: string;
}

export const createCourse = async (
  data: CourseRequest
): Promise<CourseResponse> => {
  const response = await api.post("/api/instructor/courses", data);
  return response.data;
};

export const getMyCourses = async (): Promise<CourseResponse[]> => {
  const response = await api.get("/api/instructor/courses");
  return response.data;
};

// Update course
export const updateCourse = async (
  courseId: number,
  data: CourseRequest
): Promise<CourseResponse> => {
  const response = await api.put(
    `/api/instructor/courses/${courseId}`,
    data
  );
  return response.data;
};

// Publish course
export const publishCourse = async (
  courseId: number
): Promise<CourseResponse> => {
  const response = await api.patch(
    `/api/instructor/courses/${courseId}/publish`
  );
  return response.data;
};

// Unpublish course
export const unpublishCourse = async (
  courseId: number
): Promise<CourseResponse> => {
  const response = await api.patch(
    `/api/instructor/courses/${courseId}/unpublish`
  );
  return response.data;
};

// Delete course
export const deleteCourse = async (
  courseId: number
): Promise<void> => {
  await api.delete(`/api/instructor/courses/${courseId}`);
};

