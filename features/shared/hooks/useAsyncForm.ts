import { useState } from "react";

export function useAsyncForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const run = async (fn: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    success,
    setError,
    setSuccess,
    run,
  };
}
