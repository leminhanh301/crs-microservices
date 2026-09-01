import axiosClient from './axiosClient';

export interface RegistrationPayload {
  studentId: number;
  courseId: number;
}

export interface Registration {
  id: number;
  studentId: number;
  courseId: number;
  trangThai: string;
  ngayDangKy: string;
}

export const registerCourse = (payload: RegistrationPayload) => {
  return axiosClient.post<Registration>('/api/registrations', payload);
};

export const cancelRegistration = (id: number) => {
  return axiosClient.delete(`/api/registrations/${id}`);
};

export const getMyRegistrations = () => {
  return axiosClient.get<Registration[]>('/api/registrations/my');
};
