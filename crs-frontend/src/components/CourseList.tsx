import React from 'react';
import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
  courses: Course[];
  state: LoadState;
  errorMessage: string;
  onRetry: () => void;
  onEdit?: (course: Course) => void;
  onDelete?: (id: number) => void;
  onRegister?: (course: Course) => void;
  registeringId?: number | null;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  state,
  errorMessage,
  onRetry,
  onEdit,
  onDelete,
  onRegister,
  registeringId,
}) => {
  const showActions = Boolean(onEdit || onDelete || onRegister);

  if (state === 'loading') {
    return <div>Đang tải danh sách môn học...</div>;
  }

  if (state === 'error') {
    return (
      <div style={{ color: 'red', margin: '16px 0' }}>
        <p>{errorMessage}</p>
        <button onClick={onRetry}>Thử lại</button>
      </div>
    );
  }

  if (state === 'empty' || !courses || courses.length === 0) {
    return <div>Không có môn học nào.</div>;
  }

  return (
    <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ backgroundColor: '#f0f0f0' }}>
          <th>ID</th>
          <th>Tên môn học</th>
          <th>Số tín chỉ</th>
          <th>Số chỗ tối đa</th>
          <th>Số chỗ còn lại</th>
          {showActions && <th>Thao tác</th>}
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.id}</td>
            <td>{course.tenMonHoc}</td>
            <td>{course.soTinChi}</td>
            <td>{course.soChoToiDa}</td>
            <td>{course.soChoConLai}</td>
            {showActions && (
              <td>
                {onEdit && (
                  <button onClick={() => onEdit(course)} style={{ marginRight: 8 }}>
                    Sửa
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(course.id)} style={{ color: 'red' }}>
                    Xóa
                  </button>
                )}
                {onRegister && (
                  <button
                    onClick={() => onRegister(course)}
                    disabled={course.soChoConLai === 0 || registeringId === course.id}
                  >
                    {course.soChoConLai === 0
                      ? 'Hết chỗ'
                      : registeringId === course.id
                        ? 'Đang đăng ký...'
                        : 'Đăng ký'}
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
