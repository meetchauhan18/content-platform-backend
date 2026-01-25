// libs imports
import { createBrowserRouter } from "react-router-dom";

// local imports
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { GuestRoute } from "./GuestRoute.jsx";

// Lazy load pages for code splitting
// import { lazy } from "react";
// const Login = lazy(() => import("@/features/auth/pages/Login.jsx"));
// const Register = lazy(() => import("@/features/auth/pages/Register.jsx"));
// const Dashboard = lazy(() => import("@/features/dashboard/pages/Dashboard.jsx"));

export const router = createBrowserRouter([
  // Public routes (guest only)
  {
    element: <GuestRoute />,
    children: [
      // {
      //   path: "/login",
      //   element: <Login />,
      // },
      // {
      //   path: "/register",
      //   element: <Register />,
      // },
    ],
  },

  // Protected routes (authenticated only)
  {
    element: <ProtectedRoute />,
    children: [
      // {
      //   path: "/dashboard",
      //   element: <Dashboard />,
      // },
    ],
  },

  // Public routes (accessible to all)
  {
    path: "/",
    element: <div>Home Page - Replace with your component</div>,
  },

  // 404 fallback
  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
]);
