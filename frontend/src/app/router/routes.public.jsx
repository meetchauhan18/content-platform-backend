import { lazy } from "react";
import { ROUTES } from "./routePaths";

const LandingPage = lazy(() =>
  import("../../features/Landing/pages/LandingPage.jsx")
);

export const publicRoutes = [
  {
    path: ROUTES.HOME,
    element: <LandingPage />,
  },
];
