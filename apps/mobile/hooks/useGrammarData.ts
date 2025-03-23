import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthProvider";
import { authClient } from "../lib/auth-client";

export function useGrammarData() {
  const $fetch = authClient.$fetch;
  const { session } = useAuth();
  const queryClient = useQueryClient();

  const fetchGrammar = async (): Promise<any[]> => {
    if (!session) return [];

    const response = await $fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/v1/grammar`,
    );

    if (!response) {
      throw new Error("Failed to fetch grammar");
    }

    return response.data as any;
  };

  const fetchGrammarDetails = async (slug: string): Promise<any> => {
    if (!session) return [];

    const response = await $fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/v1/grammar/${slug}`,
    );

    if (!response) {
      throw new Error("Failed to fetch grammar details");
    }

    return response.data as any;
  };

  const {
    data: grammar = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["grammar"],
    queryFn: fetchGrammar,
    enabled: !!session,
  });

  const refreshGrammar = () => {
    return queryClient.invalidateQueries({ queryKey: ["grammar"] });
  };

  return {
    grammar,
    isLoading,
    error,
    refetch,
    refreshGrammar,
  };
}
