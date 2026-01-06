import { useRouteError } from "react-router-dom";

function GlobalRouteError() {
  const error = useRouteError();

  console.error(error);

  return (
    <div className="p-2">
      <h1>Something went wrong</h1>
      <p>Please refresh or try again later.</p>
    </div>
  );
}

export default GlobalRouteError;
