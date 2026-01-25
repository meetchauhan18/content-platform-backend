import { env } from "@/core/config/env";

export function normalizeError(error) {
  // Already normalized
  if (
    error &&
    typeof error === "object" &&
    typeof error.status === "number" &&
    typeof error.message === "string"
  ) {
    return error;
  }

  // Axios error
  if (error?.isAxiosError) {
    const response = error.response;

    return {
      status: response?.status ?? 0,
      message:
        response?.data?.message ?? error.message ?? "Something went wrong",
      code: response?.data?.code,
      details: response?.data?.details,
    };
  }

  // Native JS error
  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
      stack: env?.IS_DEV ? error.stack : undefined,
    };
  }

  // Absolute fallback
  return {
    status: 500,
    message: "Unexpected error",
  };
}
