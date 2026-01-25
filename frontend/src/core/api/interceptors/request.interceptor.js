// local imports
import { normalizeError } from "@/shared/utils/normalizeError.js";

// function that helps setup request for axios
export function setupRequestInterceptor(client) {
  client.interceptors.request.use(
    (config) => {
      // Request tracing
      try {
        config.headers["x-request-id"] = crypto.randomUUID();
      } catch {
        config.headers["x-request-id"] = Math.random().toString(36).slice(2);
      }

      // return updated config
      return config;
    },
    (error) => Promise.reject(normalizeError(error)),
  );
}
