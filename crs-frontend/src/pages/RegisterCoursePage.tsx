import axios from 'axios';
import { useCallback, useState } from 'react';
import { registerCourse } from '../api/registrationApi';
import { useCourses } from '../api/useCourses';
import { CourseList } from '../components/CourseList';
import { Pagination } from '../components/Pagination';
import { SearchBox } from '../components/SearchBox';
import { Toast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import type { Course } from '../types/course';

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error) && typeof error.response?.data?.message === 'string') {
    return error.response.data.message;
  }
  return 'Đăng ký môn học thất bại.';
};

export const RegisterCoursePage = () => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);
  const { user } = useAuth();
  const { toast, showToast, hideToast } = useToast();

  const handleSearch = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0);
  }, []);

  const handleRegister = async (course: Course) => {
    if (!user || registeringId !== null) return;
    setRegisteringId(course.id);

    try {
      await registerCourse({ studentId: user.id, courseId: course.id });
      showToast('Đăng ký môn học thành công.', 'success');
      await refetch();
    } catch (error: unknown) {
      showToast(getErrorMessage(error), 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h1>Đăng ký học phần</h1>
      <SearchBox onSearch={handleSearch} />
      <CourseList
        courses={courses}
        state={state}
        errorMessage={errorMessage}
        onRetry={refetch}
        onRegister={handleRegister}
        registeringId={registeringId}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      {toast && <Toast {...toast} onClose={hideToast} />}
    </main>
  );
};
