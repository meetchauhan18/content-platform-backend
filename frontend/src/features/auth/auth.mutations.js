// libs imports
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

// local imports
import AuthService from "./auth.service.js";
import { authKeys } from "./auth.keys.js";
import { setCredentials, clearAuth } from "@/app/store";

// register mutation
export function useRegister() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => AuthService.register(payload),
    onSuccess: (response) => {
      dispatch(setCredentials(response.data));
      queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });
    },
  });
}

// login mutataion
export function useLogin() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (payload) => AuthService.login(payload),
    onSuccess: (response) => {
      dispatch(setCredentials(response.data.user));
      queryClient.invalidateQueries({
        queryKey: authKeys.profile(),
      });
    },
  });
}

// logout mutation
export function useLogout() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      dispatch(clearAuth());
      queryClient.removeQueries({
        queryKey: authKeys.all,
      });
    },
  });
}
