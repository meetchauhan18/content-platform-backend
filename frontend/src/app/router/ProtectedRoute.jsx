// libs imports
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

// local imports
import { selectIsAuthenticated, selectIsInitialized } from "@/app/store";

export function ProtectedRoute() {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
