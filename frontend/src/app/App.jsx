// libs import
import { RouterProvider } from "react-router-dom"

// local imports
import "./App.css";
import { appRouter } from "./router/index.js";

function App() {
  return (
    <RouterProvider router={appRouter} />
  );
}

export default App;
