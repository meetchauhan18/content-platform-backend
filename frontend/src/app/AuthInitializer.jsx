// libs imports
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// local imports
import { setCredentials, clearAuth } from "@/app/store";
import { setAuthFailureHandler } from "@/core/api/interceptors/response.interceptor.js";
import authService from "@/features/auth/auth.service.js";

export function AuthInitializer({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Wire up auth failure handler (breaks circular dep)
    setAuthFailureHandler(() => dispatch(clearAuth()));

    // Check auth on mount
    authService
      .profile()
      .then((response) => dispatch(setCredentials(response.data)))
      .catch(() => dispatch(clearAuth()));
  }, [dispatch]);

  return children;
}
