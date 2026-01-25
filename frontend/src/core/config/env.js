// validating env variable
function validateEnv() {
  const requiredVariables = ["VITE_API_BASE_URL"];
  const missingVariables = requiredVariables.filter(
    (variable) => !import.meta.env[variable],
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVariables.join(", ")}`,
    );
  }

  // Return typed config object
  return Object.freeze({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
  });
}

export const env = validateEnv();
