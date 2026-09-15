import api from "../api/axios";

export interface Enrollment {
  id: number;
  courseId: number;
  courseTitle: string;
  status: "ENROLLED" | "WAITLISTED" | "COMPLETED";
  enrolledAt: string;
}

export const enrollInCourse = async (
  courseId: number
): Promise<Enrollment> => {
  const response = await api.post(
    `/api/student/enrollments/courses/${courseId}`
  );

  return response.data;
};

export const getMyEnrollments = async (): Promise<Enrollment[]> => {
  const response = await api.get("/api/student/enrollments");

  return response.data;
};