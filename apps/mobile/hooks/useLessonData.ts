import { useQuery } from "@tanstack/react-query";
import { authClient } from "../lib/auth-client";
import { useAuth } from "../context/AuthProvider";

export const useLessonData = () => {
  const $fetch = authClient.$fetch;
  const { session } = useAuth();

  const fetchLesson = async (slug: string) => {
    const response = await $fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/v1/lesson/${slug}`,
    );
    console.log(response);
    return response.data;
  };

  return { fetchLesson };
};
