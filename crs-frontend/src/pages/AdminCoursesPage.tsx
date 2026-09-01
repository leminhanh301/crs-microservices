import axios from 'axios';
import { useCallback, useState } from 'react';
import { createCourse, deleteCourse, updateCourse } from '../api/courseApi';
import { useCourses } from '../api/useCourses';
import { CourseForm } from '../components/CourseForm';
import { CourseList } from '../components/CourseList';
import { Pagination } from '../components/Pagination';
import { SearchBox } from '../components/SearchBox';
import type { Course, CourseFormValues } from '../types/course';

const extractErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : 'Không thể kết nối đến máy chủ.';
  }

  const data = error.response?.data;
  if (!data) return 'Đã có lỗi xảy ra từ phía máy chủ.';
  if (typeof data === 'string') return data;
  if (typeof data.message === 'string' && data.message.trim()) return data.message;

  if (typeof data === 'object' && !Array.isArray(data)) {
    const errorMessages = Object.entries(data)
      .filter(([key, value]) =>
        typeof value === 'string' && !['status', 'error', 'timestamp', 'path'].includes(key))
      .map(([key, value]) => `${key}: ${value}`);
    if (errorMessages.length > 0) return errorMessages.join('; ');
  }

  return 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
};

export const AdminCoursesPage = () => {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

  const handleSearch = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0);
  }, []);

  const handleFormSubmit = async (values: CourseFormValues) => {
    setSubmitting(true);
    setFormError(null);
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, values);
      } else {
        await createCourse(values);
      }
      setEditingCourse(null);
      await refetch();
    } catch (error: unknown) {
      setFormError(extractErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa môn học này không?')) return;

    try {
      await deleteCourse(id);
      await refetch();
    } catch (error: unknown) {
      window.alert(`Xóa môn học thất bại: ${extractErrorMessage(error)}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setFormError(null);
  };

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h1>Quản lý Môn Học (CRS)</h1>
      <CourseForm
        editingCourse={editingCourse}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelEdit}
        submitting={submitting}
        serverError={formError}
      />
      <SearchBox onSearch={handleSearch} />
      <CourseList
        courses={courses}
        state={state}
        errorMessage={errorMessage}
        onRetry={refetch}
        onEdit={(course) => {
          setFormError(null);
          setEditingCourse(course);
        }}
        onDelete={handleDelete}
      />
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </main>
  );
};
