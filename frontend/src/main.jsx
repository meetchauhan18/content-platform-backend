// libs imports
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// local imports
import "./index.css";
import App from "./app/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
