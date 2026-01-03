/**
 * Retry Handler
 * Intelligent retry logic with exponential backoff
 *
 * Features:
 * - Exponential backoff with jitter
 * - Configurable retry conditions
 * - Request method awareness (safe methods only by default)
 * - Retry-After header support (429 responses)
 */

import { RETRY_CONFIG } from "../../config/api.config.js";

/**
 * Calculate delay for retry attempt
 * Uses exponential backoff with jitter to prevent thundering herd
 */
export function calculateRetryDelay(attemptNumber, retryAfterHeader = null) {
  // If server specifies retry-after, respect it
  if (retryAfterHeader) {
    const retryAfter = parseInt(retryAfterHeader, 10);
    if (!isNaN(retryAfter)) {
      return retryAfter * 1000; // Convert to ms
    }
  }

  // Exponential backoff: delay * multiplier^attempt
  const exponentialDelay =
    RETRY_CONFIG.RETRY_DELAY *
    Math.pow(RETRY_CONFIG.RETRY_MULTIPLIER, attemptNumber);

  // Add jitter (±25%) to prevent synchronized retries
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);

  // Cap at 30 seconds
  return Math.min(exponentialDelay + jitter, 30000);
}

/**
 * Check if request should be retried
 */
export function shouldRetry(error, config) {
  // Check if retries are exhausted
  const retryCount = config.__retryCount || 0;
  if (retryCount >= RETRY_CONFIG.MAX_RETRIES) {
    return false;
  }

  // Check if method is safe to retry
  const method = (config.method || "GET").toUpperCase();
  if (RETRY_CONFIG.NO_RETRY_METHODS.includes(method)) {
    // Only retry non-idempotent methods if explicitly marked safe
    if (!config.__forceRetry) {
      return false;
    }
  }

  // Check if path is in no-retry list
  const path = config.url || "";
  if (RETRY_CONFIG.NO_RETRY_PATHS.some((p) => path.includes(p))) {
    return false;
  }

  // Check if request was cancelled (never retry)
  if (error?.code === "ERR_CANCELED") {
    return false;
  }

  // Check if error is retryable
  if (error?.isApiError && error.isRetryable === false) {
    return false;
  }

  // Network errors are retryable
  if (error?.code === "ERR_NETWORK") {
    return true;
  }

  // Timeout errors are retryable
  if (error?.code === "ECONNABORTED") {
    return true;
  }

  // Check status code
  const status = error?.response?.status;
  if (status && RETRY_CONFIG.RETRY_STATUS_CODES.includes(status)) {
    return true;
  }

  return false;
}

/**
 * Create retry interceptor for axios
 */
export function createRetryInterceptor(axiosInstance) {
  return async (error) => {
    const config = error.config;

    if (!config || !shouldRetry(error, config)) {
      return Promise.reject(error);
    }

    // Initialize or increment retry count
    config.__retryCount = (config.__retryCount || 0) + 1;

    // Calculate delay
    const retryAfter = error.response?.headers?.["retry-after"];
    const delay = calculateRetryDelay(config.__retryCount, retryAfter);

    // Log retry attempt in development
    if (import.meta.env.DEV) {
      console.log(
        `[API Retry] Attempt ${config.__retryCount}/${RETRY_CONFIG.MAX_RETRIES} ` +
          `for ${config.method?.toUpperCase()} ${config.url} ` +
          `(delay: ${Math.round(delay)}ms)`
      );
    }

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Retry the request
    return axiosInstance.request(config);
  };
}

/**
 * Sleep utility
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  calculateRetryDelay,
  shouldRetry,
  createRetryInterceptor,
  sleep,
};
