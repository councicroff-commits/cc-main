import { useState, useEffect } from 'react';

/**
 * Delays updating a value state until a specified timeout duration has passed.
 * Prevents heavy calculations from executing multiple consecutive times during high-frequency input cycles.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler); // Clear calculation memory if updates hit within delay frame boundaries
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
