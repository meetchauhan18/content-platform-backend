// libs import
import { useQuery } from "@tanstack/react-query";

// local imports
import authService from "./auth.service.js";
import { authKeys } from "./auth.keys.js";

export function useAuthProfile({ enabled }) {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.profile(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // NEVER retry auth
  });
}
