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
      const content = res.data.content || [];
      const pages = res.data.totalPages || 0;
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
        setErrorMessage('Khong ket noi duoc toi he thong. Vui long thu lai sau.');
      } else if (err.response.data?.message && typeof err.response.data.message === 'string') {
        setErrorMessage(err.response.data.message);
      } else if (typeof err.response.data === 'string') {
        setErrorMessage(err.response.data);
      } else {
        setErrorMessage('Da co loi chay lai request. Vui long thu lai sau.');
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
