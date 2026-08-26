import type { LoadState } from '../api/useCourses';
import type { Course } from '../types/course';

interface CourseListProps { courses: Course[]; state: LoadState; errorMessage: string; onRetry: () => void; }

export default function CourseList({ courses, state, errorMessage, onRetry }: CourseListProps) {
  if (state === 'loading') return <div className="status-card" role="status"><span className="spinner" aria-hidden="true" /><p>Đang tải danh sách môn học...</p></div>;
  if (state === 'error') return <div className="status-card status-card--error" role="alert"><strong>Không thể tải dữ liệu</strong><p>{errorMessage}</p><button type="button" onClick={onRetry}>Thử lại</button></div>;
  if (state === 'empty') return <div className="status-card"><span className="status-card__symbol" aria-hidden="true">∅</span><strong>Không tìm thấy môn học</strong><p>Hãy thử một từ khóa khác.</p></div>;

  return (
    <div className="table-wrap"><table><thead><tr><th>Tên môn học</th><th>Số tín chỉ</th><th>Số chỗ còn lại</th></tr></thead>
      <tbody>{courses.map((course) => <tr key={course.id}>
        <td data-label="Tên môn học"><strong>{course.tenMonHoc}</strong></td>
        <td data-label="Số tín chỉ">{course.soTinChi}</td>
        <td data-label="Số chỗ còn lại"><span className={course.soChoConLai === 0 ? 'seats seats--full' : 'seats'}>{course.soChoConLai} / {course.soChoToiDa}</span></td>
      </tr>)}</tbody></table></div>
  );
}
