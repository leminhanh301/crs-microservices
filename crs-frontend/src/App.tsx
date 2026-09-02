// path: crs-frontend/src/App.tsx
// purpose: rap CourseForm + CourseList + Pagination + SearchBox, xu ly Them/Sua/Xoa
// va dong bo lai danh sach (refetch) sau moi thao tac thanh cong

import { useState } from 'react';
import axios from 'axios';
import { useCourses } from './api/useCourses';
import { createCourse, updateCourse, deleteCourse } from './api/courseApi';
import SearchBox from './components/SearchBox';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';
import CourseForm from './components/CourseForm';
import type { Course, CourseFormValues } from './types/course';
import './App.css';

function App() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);

  const handleSearch = (newKeyword: string) => {
    setKeyword(newKeyword);
    setPage(0);
  };

  const extractErrorMessage = (err: unknown): string => {
    if (!axios.isAxiosError(err)) {
      return err instanceof Error ? err.message : 'Đã xảy ra lỗi, vui lòng thử lại.';
    }

    if (err.response?.status === 401 || err.response?.status === 403) {
      return 'Lỗi 401/403: Không có quyền truy cập hoặc token không hợp lệ (ROLE_ADMIN).';
    }

    const data = err.response?.data;
    if (!data) return 'Không thể kết nối tới máy chủ (Network Error).';
    if (typeof data === 'string') return data;
    if (typeof data.message === 'string' && data.message.trim()) return data.message;
    if (typeof data.error === 'string' && data.error.trim()) return data.error;

    if (typeof data === 'object' && !Array.isArray(data)) {
      const errorMessages = Object.entries(data)
        .filter(([key, value]) =>
          typeof value === 'string' && !['status', 'timestamp', 'path'].includes(key))
        .map(([key, value]) => `${key}: ${value}`);
      if (errorMessages.length > 0) return errorMessages.join('; ');
    }

    return 'Đã xảy ra lỗi, vui lòng thử lại.';
  };

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
      refetch(); // dong bo lai danh sach ngay sau khi luu thanh cong
    } catch (err) {
      setFormError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!window.confirm(`Xoa mon hoc "${course.tenMonHoc}"?`)) return;
    try {
      await deleteCourse(course.id);
      refetch();
    } catch (err) {
      alert(extractErrorMessage(err));
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto' }}>
      <h1>Quan ly mon hoc (Admin)</h1>
      <CourseForm
        editingCourse={editingCourse}
        onSubmit={handleFormSubmit}
        onCancel={() => setEditingCourse(null)}
        submitting={submitting}
        serverError={formError}
      />
      <SearchBox onSearch={handleSearch} />
      <div style={{ marginTop: 16 }}>
        <CourseList
          courses={courses}
          state={state}
          errorMessage={errorMessage}
          onRetry={refetch}
          onEdit={setEditingCourse}
          onDelete={handleDelete}
        />
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}

export default App;
