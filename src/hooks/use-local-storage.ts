"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

type SetValue<T> = Dispatch<SetStateAction<T>>;

function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // useEffect to load the value from localStorage after initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        const value = item ? JSON.parse(item) : initialValue;
        setStoredValue(value);
      } catch (error) {
        // If error also return initialValue
        console.error(`Error reading localStorage key “${key}”:`, error);
        setStoredValue(initialValue);
      } finally {
        setIsInitialized(true); // Mark as initialized after attempting to load
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Only run on mount (and if key changes, though it shouldn't)


  // useEffect to update localStorage when the state changes
  useEffect(() => {
    // Only save to localStorage if the hook has been initialized
    if (isInitialized && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
      }
    }
  }, [key, storedValue, isInitialized]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
