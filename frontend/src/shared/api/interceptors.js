/**
 * Axios Request/Response Interceptors
 * Core interceptor logic separated for clarity and testability
 */

import { tokenManager } from "./tokenManager.js";
import { requestQueue } from "./requestQueue.js";
import { cancelManager } from "./cancelManager.js";
import { createApiError, AuthError } from "../errors/ApiError.js";
import { DEBUG_CONFIG, HTTP_STATUS } from "../../config/api.config.js";

/**
 * Request Interceptor
 * Runs before every request
 */
export function createRequestInterceptor() {
  return {
    onFulfilled: (config) => {
      // Add request ID for tracing
      config.headers["X-Request-ID"] = crypto.randomUUID();

      // Add timestamp for performance tracking
      config.metadata = { startTime: Date.now() };

      // Attach auth token if available
      const authHeader = tokenManager.getAuthHeader();
      if (authHeader && !config.headers.Authorization) {
        config.headers.Authorization = authHeader;
      }

      // Setup cancellation if enabled
      if (config.cancelable !== false) {
        const { signal, key } = cancelManager.getController(
          config,
          config.cancelPrevious || false
        );
        config.signal = signal;
        config.__cancelKey = key;
      }

      // Log request in development
      if (DEBUG_CONFIG.ENABLE_REQUEST_LOGGING) {
        console.log(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
          config.params || config.data || ""
        );
      }

      return config;
    },

    onRejected: (error) => {
      return Promise.reject(createApiError(error));
    },
  };
}

/**
 * Response Interceptor
 * Runs after every response
 */
export function createResponseInterceptor(axiosInstance, onAuthError) {
  return {
    onFulfilled: (response) => {
      // Calculate response time
      const duration = response.config?.metadata?.startTime
        ? Date.now() - response.config.metadata.startTime
        : null;

      // Remove from cancel manager
      if (response.config?.__cancelKey) {
        cancelManager.remove(response.config.__cancelKey);
      }

      // Log response in development
      if (DEBUG_CONFIG.ENABLE_RESPONSE_LOGGING) {
        console.log(
          `[API Response] ${response.status} ${response.config?.url}`,
          duration ? `(${duration}ms)` : ""
        );
      }

      return response;
    },

    onRejected: async (error) => {
      const originalRequest = error.config;

      // Remove from cancel manager
      if (originalRequest?.__cancelKey) {
        cancelManager.remove(originalRequest.__cancelKey);
      }

      // Log error
      if (DEBUG_CONFIG.ENABLE_ERROR_LOGGING) {
        console.error(
          `[API Error] ${error.response?.status || "Network"} ${
            originalRequest?.url
          }`,
          error.response?.data?.message || error.message
        );
      }

      // Handle 401 - attempt token refresh
      if (
        error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
        !originalRequest?.__isRetry
      ) {
        return handleUnauthorized(axiosInstance, originalRequest, onAuthError);
      }

      return Promise.reject(createApiError(error, error.response));
    },
  };
}

/**
 * Handle 401 Unauthorized - Token Refresh Flow
 */
async function handleUnauthorized(axiosInstance, originalRequest, onAuthError) {
  // If refresh is already in progress, queue this request
  if (requestQueue.isRefreshInProgress()) {
    try {
      const newToken = await requestQueue.enqueue();
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      originalRequest.__isRetry = true;
      return axiosInstance.request(originalRequest);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // No refresh token - force logout
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    onAuthError?.(new AuthError("No refresh token available"));
    return Promise.reject(new AuthError("Session expired"));
  }

  // Start refresh process
  requestQueue.startRefresh();

  try {
    // Call refresh endpoint
    const response = await axiosInstance.post(
      "/auth/refresh-token",
      {
        refreshToken,
      },
      {
        __skipAuth: true, // Don't attach token to this request
        __isRefresh: true,
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;

    // Update tokens
    tokenManager.setTokens(accessToken, newRefreshToken);

    // Resolve all queued requests
    requestQueue.resolveAll(accessToken);

    // Retry original request
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    originalRequest.__isRetry = true;
    return axiosInstance.request(originalRequest);
  } catch (refreshError) {
    console.log(refreshError);
    // Refresh failed - clear tokens and reject all
    tokenManager.clearTokens();
    requestQueue.rejectAll(new AuthError("Token refresh failed"));
    onAuthError?.(new AuthError("Session expired"));
    return Promise.reject(new AuthError("Session expired"));
  }
}

export default {
  createRequestInterceptor,
  createResponseInterceptor,
};
