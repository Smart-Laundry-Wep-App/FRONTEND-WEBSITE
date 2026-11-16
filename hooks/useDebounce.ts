import { useEffect, useState } from "react";

/**
 * Custom Hook: useDebounce
 * Menunda pembaruan nilai input (misal search input) untuk menghindari pemanggilan API berlebih
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
