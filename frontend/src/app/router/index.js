// libs imports
import { createBrowserRouter } from "react-router-dom";

// local imports
import { publicRoutes } from "./routes.public.jsx";
import { protectedRoutes } from "./routes.protected.jsx";

// export app router where public and protected routes are spread out
export const appRouter = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes,
]);
