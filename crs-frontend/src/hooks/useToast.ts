import { useCallback, useEffect, useState } from 'react';
import type { ToastMessage, ToastType } from '../components/Toast';

export const useToast = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const hideToast = useCallback(() => setToast(null), []);
  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(hideToast, 3500);
    return () => window.clearTimeout(timer);
  }, [toast, hideToast]);

  return { toast, showToast, hideToast };
};
