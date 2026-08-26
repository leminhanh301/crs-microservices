import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getCourses } from './courseApi';
import type { ApiErrorResponse } from '../types/apiError';
import type { Course } from '../types/course';

export type LoadState = 'loading' | 'success' | 'empty' | 'error';

const MINIMUM_LOADING_TIME_MS = 5_000;

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

export function useCourses(keyword: string, page: number, size = 10) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [state, setState] = useState<LoadState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [requestKey, setRequestKey] = useState(0);

  const refetch = useCallback(() => setRequestKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        setState('loading');
        setErrorMessage('');
      }
    });

    Promise.allSettled([
      getCourses(keyword, page, size, controller.signal),
      wait(MINIMUM_LOADING_TIME_MS),
    ])
      .then(([courseResult]) => {
        if (courseResult.status === 'rejected') throw courseResult.reason;

        const { data } = courseResult.value;
        setCourses(data.content);
        setTotalPages(data.totalPages);
        setState(data.content.length === 0 ? 'empty' : 'success');
      })
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return;
        let message = 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.';
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
          if (error.response?.data?.message) message = error.response.data.message;
          else if (!error.response) message = 'Không kết nối được tới hệ thống. Vui lòng thử lại sau.';
        }
        setCourses([]);
        setTotalPages(0);
        setErrorMessage(message);
        setState('error');
      });

    return () => controller.abort();
  }, [keyword, page, size, requestKey]);

  return { courses, totalPages, state, errorMessage, refetch };
}
