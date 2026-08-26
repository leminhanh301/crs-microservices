import { useCallback, useState } from 'react';
import { useCourses } from './api/useCourses';
import CourseList from './components/CourseList';
import Pagination from './components/Pagination';
import SearchBox from './components/SearchBox';
import './App.css';

function App() {
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const { courses, totalPages, state, errorMessage, refetch } = useCourses(keyword, page);
  const handleSearch = useCallback((newKeyword: string) => { setKeyword(newKeyword); setPage(0); }, []);

  return (
    <main className="app-shell">
      <header className="page-header"><span className="eyebrow">CRS · Course Registration System</span><h1>Danh sách môn học</h1><p>Tra cứu môn học, số tín chỉ và tình trạng chỗ trống hiện tại.</p></header>
      <section className="course-panel" aria-labelledby="course-panel-title">
        <div className="course-panel__toolbar"><div><h2 id="course-panel-title">Môn học đang mở</h2><p>Kết quả được cập nhật qua API Gateway.</p></div><SearchBox onSearch={handleSearch} /></div>
        <CourseList courses={courses} state={state} errorMessage={errorMessage} onRetry={refetch} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </main>
  );
}

export default App;
