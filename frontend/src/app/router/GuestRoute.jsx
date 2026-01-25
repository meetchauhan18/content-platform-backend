// libs imports
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// local imports
import { selectIsAuthenticated, selectIsInitialized } from "@/app/store";

export function GuestRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
}
