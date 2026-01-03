/**
 * Axios API Client
 * Enterprise-grade HTTP client for Vami Platform
 *
 * Features:
 * ✅ Environment-based configuration
 * ✅ Automatic token attachment
 * ✅ Token refresh with request queuing
 * ✅ Request cancellation management
 * ✅ Retry with exponential backoff
 * ✅ Response transformation
 * ✅ Request/Response logging
 * ✅ Performance tracking
 * ✅ Type-specific timeouts
 *
 * DSA Pattern: Singleton + Factory
 * - Single axios instance for connection pooling
 * - Factory methods for different request types
 */

import axios from "axios";
import {
  API_CONFIG,
  TIMEOUT_CONFIG,
  DEFAULT_HEADERS,
} from "../../config/api.config.js";
import {
  createRequestInterceptor,
  createResponseInterceptor,
} from "./interceptors.js";
import { createRetryInterceptor } from "./utils/retryHandler.js";
import { tokenManager } from "./utils/tokenManager.js";
import { cancelManager } from "./utils/cancelManager.js";

// Callback for auth errors (will be set by auth store)
let authErrorCallback = null;

/**
 * Set auth error callback
 * Called when token refresh fails and user needs to re-login
 */
export function setAuthErrorHandler(callback) {
  authErrorCallback = callback;
}

/**
 * Create the base axios instance
 */
function createApiClient() {
  const instance = axios.create({
    baseURL: API_CONFIG.API_BASE,
    timeout: TIMEOUT_CONFIG.DEFAULT,
    headers: DEFAULT_HEADERS,
    withCredentials: true, // Send cookies for refresh token
  });

  // Request interceptor
  const requestInterceptor = createRequestInterceptor();
  instance.interceptors.request.use(
    requestInterceptor.onFulfilled,
    requestInterceptor.onRejected
  );

  // Response interceptor
  const responseInterceptor = createResponseInterceptor(instance, (error) =>
    authErrorCallback?.(error)
  );
  instance.interceptors.response.use(
    responseInterceptor.onFulfilled,
    responseInterceptor.onRejected
  );

  // Retry interceptor (on error)
  instance.interceptors.response.use(
    (response) => response,
    createRetryInterceptor(instance)
  );

  return instance;
}

// Create singleton instance
const apiClient = createApiClient();

// ==================== REQUEST METHODS ====================

/**
 * GET request
 */
export async function get(url, params = {}, config = {}) {
  const response = await apiClient.get(url, { params, ...config });
  return response.data;
}

/**
 * POST request
 */
export async function post(url, data = {}, config = {}) {
  const response = await apiClient.post(url, data, config);
  return response.data;
}

/**
 * PUT request
 */
export async function put(url, data = {}, config = {}) {
  const response = await apiClient.put(url, data, config);
  return response.data;
}

/**
 * PATCH request
 */
export async function patch(url, data = {}, config = {}) {
  const response = await apiClient.patch(url, data, config);
  return response.data;
}

/**
 * DELETE request
 */
export async function del(url, config = {}) {
  const response = await apiClient.delete(url, config);
  return response.data;
}

// ==================== SPECIALIZED REQUESTS ====================

/**
 * Upload file(s)
 * Uses longer timeout and multipart/form-data
 */
export async function upload(url, formData, config = {}) {
  const response = await apiClient.post(url, formData, {
    timeout: TIMEOUT_CONFIG.UPLOAD,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: config.onProgress,
    ...config,
  });
  return response.data;
}

/**
 * Download file
 * Returns blob for file download
 */
export async function download(url, config = {}) {
  const response = await apiClient.get(url, {
    timeout: TIMEOUT_CONFIG.DOWNLOAD,
    responseType: "blob",
    onDownloadProgress: config.onProgress,
    ...config,
  });
  return response.data;
}

/**
 * Auth request (no retry on failure)
 */
export async function authRequest(method, url, data = {}, config = {}) {
  const response = await apiClient.request({
    method,
    url,
    data,
    timeout: TIMEOUT_CONFIG.AUTH,
    __skipRetry: true,
    ...config,
  });
  return response.data;
}

// ==================== UTILITY EXPORTS ====================

/**
 * Cancel all pending requests
 */
export function cancelAllRequests(reason) {
  cancelManager.cancelAll(reason);
}

/**
 * Cancel requests matching pattern
 */
export function cancelRequests(pattern, reason) {
  cancelManager.cancelMatching(pattern, reason);
}

/**
 * Get pending request count
 */
export function getPendingCount() {
  return cancelManager.pendingCount();
}

/**
 * Check if authenticated
 */
export function isAuthenticated() {
  return tokenManager.hasValidAccessToken();
}

/**
 * Clear authentication
 */
export function clearAuth() {
  tokenManager.clearTokens();
}

// ==================== EXPORTS ====================

export { apiClient, tokenManager, cancelManager };

export default {
  get,
  post,
  put,
  patch,
  delete: del,
  upload,
  download,
  authRequest,
  cancelAllRequests,
  cancelRequests,
  getPendingCount,
  isAuthenticated,
  clearAuth,
  setAuthErrorHandler,
  client: apiClient,
  tokenManager,
  cancelManager,
};
