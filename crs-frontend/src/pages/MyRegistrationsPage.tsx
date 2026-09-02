import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { getCourseById } from '../api/courseApi';
import {
  cancelRegistration,
  getMyRegistrations,
  type Registration,
} from '../api/registrationApi';
import { Toast } from '../components/Toast';
import { useToast } from '../hooks/useToast';

interface RegistrationWithCourseName extends Registration {
  courseName: string;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }
  return fallback;
};

export const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<RegistrationWithCourseName[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await getMyRegistrations();
      const activeRegistrations = response.data.filter(
        (registration) =>
          registration.trangThai === 'DA_DANG_KY' || registration.trangThai === 'DA DANG KY',
      );
      const withCourseNames = await Promise.all(
        activeRegistrations.map(async (registration) => {
          try {
            const courseResponse = await getCourseById(registration.courseId);
            return { ...registration, courseName: courseResponse.data.tenMonHoc };
          } catch {
            return { ...registration, courseName: `Môn học #${registration.courseId}` };
          }
        }),
      );
      setRegistrations(withCourseNames);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error, 'Không thể tải danh sách môn học đã đăng ký.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- load remote data on mount.
    void loadRegistrations();
  }, [loadRegistrations]);

  const handleCancel = async (registrationId: number) => {
    if (cancellingId !== null || !window.confirm('Bạn có chắc chắn muốn hủy đăng ký này không?')) {
      return;
    }

    setCancellingId(registrationId);
    try {
      await cancelRegistration(registrationId);
      showToast('Hủy đăng ký thành công.', 'success');
      await loadRegistrations();
    } catch (error: unknown) {
      showToast(getErrorMessage(error, 'Hủy đăng ký thất bại.'), 'error');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h1>Môn học đã đăng ký</h1>
      {loading && <p>Đang tải danh sách đăng ký...</p>}
      {!loading && errorMessage && (
        <div style={{ color: 'red' }}>
          <p>{errorMessage}</p>
          <button type="button" onClick={() => void loadRegistrations()}>Thử lại</button>
        </div>
      )}
      {!loading && !errorMessage && registrations.length === 0 && (
        <p>Chưa có môn học nào được đăng ký.</p>
      )}
      {!loading && !errorMessage && registrations.length > 0 && (
        <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID đăng ký</th>
              <th>Môn học</th>
              <th>Ngày đăng ký</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((registration) => (
              <tr key={registration.id}>
                <td>{registration.id}</td>
                <td>{registration.courseName}</td>
                <td>{registration.ngayDangKy}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => void handleCancel(registration.id)}
                    disabled={cancellingId === registration.id}
                  >
                    {cancellingId === registration.id ? 'Đang hủy...' : 'Hủy đăng ký'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {toast && <Toast {...toast} onClose={hideToast} />}
    </main>
  );
};
