import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authClient } from "../lib/auth-client";

export function useCourseData() {
  const $fetch = authClient.$fetch;
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const fetchCourses = async (): Promise<any[]> => {
    if (!session) return [];
    const response = await $fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/v1/course`,
    );
    if (!response) {
      throw new Error("Failed to fetch courses");
    }

    return response.data.courses;
  };

  const {
    data: courses = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
    enabled: !!session, // Only run the query when session exists
  });

  const refreshCourses = () => {
    return queryClient.invalidateQueries({ queryKey: ["courses"] });
  };

  return {
    courses,
    isLoading,
    error,
    refreshCourses,
  };
}
