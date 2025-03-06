import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthProvider';

// Define your course type
interface Course {
  id: string;
  title: string;
  // Add other properties
}

export function useCourseData() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const fetchCourses = async (): Promise<Course[]> => {
    if (!session) return [];
    
    const response = await fetch('http://localhost:8787/v1/course', {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    return response.json();
  };

  const { data: courses = [], isLoading, error, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    enabled: !!session, // Only run the query when session exists
  });

  const refreshCourses = () => {
    return queryClient.invalidateQueries({ queryKey: ['courses'] });
  };

  return {
    courses,
    isLoading,
    error,
    refreshCourses,
  };
} 