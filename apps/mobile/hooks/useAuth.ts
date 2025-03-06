import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  const appleSignIn = async () => {
    console.log("Apple Sign In");
  };
}
