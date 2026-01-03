/**
 * API Module Barrel Export
 * Clean public interface for the API layer
 *
 * Usage:
 * import api from '@/shared/api';
 * import { get, post, tokenManager } from '@/shared/api';
 */

// Main client methods
export {
  default as api,
  get,
  post,
  put,
  patch,
  del as delete,
  upload,
  download,
  authRequest,
  cancelAllRequests,
  cancelRequests,
  getPendingCount,
  isAuthenticated,
  clearAuth,
  setAuthErrorHandler,
  apiClient,
  tokenManager,
  cancelManager,
} from "./apiClient.js";

// Error classes
export {
  ApiError,
  NetworkError,
  TimeoutError,
  AuthError,
  ForbiddenError,
  ValidationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServerError,
  CancelledError,
  createApiError,
} from "./errors/ApiError.js";

// Utilities (for advanced use cases)
export { requestQueue } from "./utils/requestQueue.js";
export { createRetryInterceptor, shouldRetry } from "./utils/retryHandler.js";
