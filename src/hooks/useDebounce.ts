import { useState, useEffect } from 'react';

/**
 * Хук для создания дебаунсированного значения
 * @param value Значение, которое нужно дебаунсировать
 * @param delay Задержка в миллисекундах
 * @returns Дебаунсированное значение
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Устанавливаем таймер, который обновит дебаунсированное значение после задержки
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер, если значение изменилось до истечения задержки
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
