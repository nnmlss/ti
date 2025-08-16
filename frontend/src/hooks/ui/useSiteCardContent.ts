import { useAuth } from "@hooks/auth/useAuth";

export function useSiteCardContent() {
  const { isAuthenticated } = useAuth();

  return {
    isAuthenticated,
  };
}