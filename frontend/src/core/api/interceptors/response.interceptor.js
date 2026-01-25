// local imports
import { normalizeError } from "@/shared/utils/normalizeError.js";

let isRefreshing = false;
let failedQueue = [];
let onAuthFailure = null;
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;

// Inject callback to avoid circular dependency with store
export function setAuthFailureHandler(handler) {
  onAuthFailure = handler;
}

function processQueue(error, shouldRetry = false) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (shouldRetry) {
      resolve(true);
    } else {
      reject(error);
    }
  });
  failedQueue = [];
}

export function setupResponseInterceptor(client) {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const status = error?.response?.status;

      // Skip refresh logic for refresh-token endpoint itself
      const isRefreshRequest = originalRequest.url?.includes("refresh-token");

      if (status === 401 && !originalRequest._retry && !isRefreshRequest) {
        // Prevent infinite refresh loops
        if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
          refreshAttempts = 0;
          onAuthFailure?.();
          return Promise.reject(normalizeError(error));
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((shouldRetry) => {
            if (shouldRetry) {
              return client(originalRequest);
            }
            return Promise.reject(normalizeError(error));
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        refreshAttempts++;

        try {
          await client.post("/auth/refresh-token");
          refreshAttempts = 0; // Reset on success
          processQueue(null, true);
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, false);
          onAuthFailure?.();
          return Promise.reject(normalizeError(refreshError));
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(normalizeError(error));
    },
  );
}
