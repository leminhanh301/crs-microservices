// path: crs-frontend/src/components/CourseList.tsx
// purpose: bo sung nut Sua/Xoa tren moi dong, giu nguyen xu ly 4 trang thai tu Buoi 6

import type { Course } from '../types/course';
import type { LoadState } from '../api/useCourses';

interface CourseListProps {
  courses: Course[];
  state: LoadState;
  errorMessage: string;
  onRetry: () => void;
  onEdit?: (course: Course) => void;
  onDelete?: (course: Course) => void;
}

export default function CourseList({
  courses,
  state,
  errorMessage,
  onRetry,
  onEdit,
  onDelete,
}: CourseListProps) {
  if (state === 'loading') return <div className="status-card" role="status"><span className="spinner" aria-hidden="true" /><p>Đang tải danh sách môn học...</p></div>;
  if (state === 'error') {
    return (
      <div className="status-card status-card--error" role="alert">
        <strong>Không thể tải dữ liệu</strong>
        <p>{errorMessage}</p>
        <button type="button" onClick={onRetry}>Thử lại</button>
      </div>
    );
  }
  if (state === 'empty') return <div className="status-card"><span className="status-card__symbol" aria-hidden="true">∅</span><strong>Không tìm thấy môn học nào phù hợp.</strong></div>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Số chỗ còn lại</th>
            {(onEdit || onDelete) && <th>Thao tác</th>}
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td data-label="Tên môn học"><strong>{course.tenMonHoc}</strong></td>
              <td data-label="Số tín chỉ">{course.soTinChi}</td>
              <td data-label="Số chỗ còn lại" style={{ color: course.soChoConLai === 0 ? '#b91c1c' : 'inherit' }}>
                <span className={course.soChoConLai === 0 ? 'seats seats--full' : 'seats'}>
                  {course.soChoConLai} / {course.soChoToiDa}
                </span>
              </td>
              {(onEdit || onDelete) && (
                <td data-label="Thao tác">
                  {onEdit && <button type="button" onClick={() => onEdit(course)}>Sửa</button>}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(course)}
                      style={{ marginLeft: 8, color: '#b91c1c' }}
                    >
                      Xóa
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
