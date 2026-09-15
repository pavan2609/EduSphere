import api from "../api/axios";

export interface StudentCourse {
  id: number;
  title: string;
  description: string;
  status: string;
  instructorId: number;
  instructorName: string;
}

export interface StudentCoursePage {
  content: StudentCourse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface StudentCourseParams {
  page?: number;
  size?: number;
  search?: string;
  sortBy?: string;
  direction?: string;
}

export const getStudentCourses = async (
  params: StudentCourseParams = {}
): Promise<StudentCoursePage> => {
  const response = await api.get("/api/student/courses", {
    params: {
      page: params.page ?? 0,
      size: params.size ?? 6,
      search: params.search ?? "",
      sortBy: params.sortBy ?? "title",
      direction: params.direction ?? "asc",
    },
  });

  return response.data;
};
