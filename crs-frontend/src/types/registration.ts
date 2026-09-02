export interface Registration {
  id: number;
  studentId: number;
  courseId: number;
  trangThai: 'DA_DANG_KY' | 'DA_HUY' | string;
  ngayDangKy: string;
}

export interface RegistrationRequest {
  studentId: number;
  courseId: number;
}