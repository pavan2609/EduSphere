import api from "../api/axios";

export interface ModuleRequest {
  title: string;
  moduleOrder: number;
}

export interface ModuleResponse {
  id: number;
  title: string;
  moduleOrder: number;
  courseId: number;
}

export interface ModuleReorderRequest {
  moduleOrder: number;
}

export const createModule = async (
  courseId: number,
  data: ModuleRequest
): Promise<ModuleResponse> => {
  const response = await api.post(
    `/api/instructor/courses/${courseId}/modules`,
    data
  );

  return response.data;
};

export const getModules = async (
  courseId: number
): Promise<ModuleResponse[]> => {
  const response = await api.get(
    `/api/instructor/courses/${courseId}/modules`
  );

  return response.data;
};

export const updateModule = async (
  courseId: number,
  moduleId: number,
  data: ModuleRequest
): Promise<ModuleResponse> => {
  const response = await api.put(
    `/api/instructor/courses/${courseId}/modules/${moduleId}`,
    data
  );

  return response.data;
};

export const deleteModule = async (
  courseId: number,
  moduleId: number
): Promise<void> => {
  await api.delete(
    `/api/instructor/courses/${courseId}/modules/${moduleId}`
  );
};

export const reorderModule = async (
  courseId: number,
  moduleId: number,
  data: ModuleReorderRequest
): Promise<ModuleResponse> => {
  const response = await api.patch(
    `/api/instructor/courses/${courseId}/modules/${moduleId}/reorder`,
    data
  );

  return response.data;
};