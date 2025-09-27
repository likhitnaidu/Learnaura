import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';

// Hook for fetching students
export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: apiService.getStudents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching teachers
export function useTeachers() {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: apiService.getTeachers,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook for fetching lessons
export function useLessons() {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: apiService.getLessons,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for fetching events
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: apiService.getEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for updating lesson order (drag-and-drop)
export function useUpdateLessonOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.reorderLessons,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });
}

// Hook for updating student data
export function useUpdateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiService.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// Hook for creating events
export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// Custom hook for local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}