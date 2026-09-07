import api from "../api/axios";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const registerUser = async (
  data: RegisterRequest
) => {
  const response = await api.post(
    "/api/auth/register",
    data
  );

  return response.data;
};

export const loginUser = async (
  data: LoginRequest
) => {
  const response = await api.post(
    "/api/auth/login",
    data
  );

  return response.data;
};