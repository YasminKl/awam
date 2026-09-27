import { useCallback, useState } from 'react';
import { ApiError } from '../Services/api';

interface FormStatus {
  isSubmitting: boolean;
  error: string | null;
  success: string | null;
}

const initialStatus: FormStatus = { isSubmitting: false, error: null, success: null };

export function useFormStatus() {
  const [status, setStatus] = useState<FormStatus>(initialStatus);

  const run = useCallback(async (action: () => Promise<void>, successMessage?: string) => {
    setStatus({ isSubmitting: true, error: null, success: null });
    try {
      await action();
      setStatus({ isSubmitting: false, error: null, success: successMessage ?? null });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Une erreur est survenue. Veuillez réessayer.';
      setStatus({ isSubmitting: false, error: message, success: null });
    }
  }, []);

  const reset = useCallback(() => setStatus(initialStatus), []);

  return { ...status, run, reset };
}