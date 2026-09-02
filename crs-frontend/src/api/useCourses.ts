import { useCallback, useEffect, useState } from 'react';
import { getCourses } from './courseApi';
import type { Course } from '../types/course';

export type LoadState = 'loading' | 'success' | 'empty' | 'error';

export const useCourses = (keyword: string = '', page: number = 0, size: number = 10) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [state, setState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fetchCourses = useCallback(async () => {
    setState('loading');
    setErrorMessage('');
    try {
      const res = await getCourses(keyword, page, size);
      const rawData = res.data as any;
      let content: Course[] = [];
      let pages = 0;

      if (Array.isArray(rawData)) {
        const kw = keyword.toLowerCase().trim();
        const filtered = kw ? rawData.filter((c: Course) => c.tenMonHoc?.toLowerCase().includes(kw)) : rawData;
        content = filtered;
        pages = Math.ceil(filtered.length / size) || 1;
      } else if (rawData && Array.isArray(rawData.content)) {
        content = rawData.content;
        pages = rawData.totalPages || 0;
      }

      setCourses(content);
      setTotalPages(pages);

      if (content.length > 0) {
        setState('success');
      } else {
        setState('empty');
      }
    } catch (err: any) {
      setState('error');
      if (!err.response) {
        setErrorMessage('Không kết nối được tới hệ thống. Vui lòng thử lại sau.');
      } else if (err.response.data?.message && typeof err.response.data.message === 'string') {
        setErrorMessage(err.response.data.message);
      } else if (typeof err.response.data === 'string') {
        setErrorMessage(err.response.data);
      } else {
        setErrorMessage('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  }, [keyword, page, size]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    totalPages,
    state,
    errorMessage,
    refetch: fetchCourses,
  };
};
