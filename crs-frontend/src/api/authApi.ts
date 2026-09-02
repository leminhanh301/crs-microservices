import axiosClient from './axiosClient';
import type { LoginRequest, LoginResponse } from '../types/auth';

export const loginRequest = (credentials: LoginRequest) => {
  return axiosClient.post<LoginResponse>('/api/auth/login', credentials);
};
