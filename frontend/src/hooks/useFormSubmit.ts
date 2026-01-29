import { useState, useCallback } from "react";

interface UseFormSubmitOptions<T> {
  onSubmit: (data: T) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseFormSubmitReturn<T> {
  isSubmitting: boolean;
  error: string | null;
  handleSubmit: (data: T) => Promise<void>;
  resetError: () => void;
}

/**
 * Custom hook to handle form submission with loading and error states
 * @param options - Configuration object with submit handler
 * @returns Form submission state and handler
 */
export function useFormSubmit<T>(
  options: UseFormSubmitOptions<T>,
): UseFormSubmitReturn<T> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: T) => {
      setIsSubmitting(true);
      setError(null);

      try {
        await options.onSubmit(data);
        options.onSuccess?.();
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error || err.message || "An error occurred";
        setError(errorMessage);
        options.onError?.(err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [options],
  );

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSubmitting,
    error,
    handleSubmit,
    resetError,
  };
}
