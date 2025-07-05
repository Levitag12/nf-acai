import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

const API_URL = import.meta.env.VITE_API_URL;

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/auth/user`, {
        credentials: "include",
      });

      if (!res.ok) {
        return null;
      }

      try {
        return await res.json();
      } catch {
        return null;
      }
    },
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
