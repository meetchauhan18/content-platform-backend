/**
 * API Configuration
 * Enterprise-grade configuration for HTTP client
 *
 * Features:
 * - Environment-based URLs
 * - Timeout configurations by request type
 * - Retry policies
 * - Rate limiting thresholds
 */

// Environment detection
const isDevelopment = import.meta.env.DEV;

// Base URLs
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  API_VERSION: import.meta.env.VITE_API_VERSION || "v1",

  get API_BASE() {
    return `${this.BASE_URL}/api/${this.API_VERSION}`;
  },
};

// Timeout configurations (in milliseconds)
export const TIMEOUT_CONFIG = {
  DEFAULT: 10000, // 10s - Standard requests
  UPLOAD: 60000, // 60s - File uploads
  DOWNLOAD: 30000, // 30s - File downloads
  AUTH: 15000, // 15s - Authentication
  LONG_POLLING: 120000, // 2m  - Long polling
};

// Retry configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // Base delay in ms
  RETRY_MULTIPLIER: 2, // Exponential backoff multiplier
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],

  // Non-retryable conditions
  NO_RETRY_METHODS: ["POST", "PUT", "PATCH", "DELETE"],
  NO_RETRY_PATHS: ["/auth/login", "/auth/register"],
};

// Rate limiting (client-side awareness)
export const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS_PER_SECOND: 10,
  QUEUE_SIZE: 100,
  THROTTLE_DELAY: 100, // ms between queued requests
};

// Token configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: "vami_access_token",
  REFRESH_TOKEN_KEY: "vami_refresh_token",
  TOKEN_TYPE: "Bearer",
  REFRESH_THRESHOLD: 60 * 1000, // Refresh 1 min before expiry
};

// HTTP Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

// Request headers
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Development logging
export const DEBUG_CONFIG = {
  ENABLE_REQUEST_LOGGING: isDevelopment,
  ENABLE_RESPONSE_LOGGING: isDevelopment,
  ENABLE_ERROR_LOGGING: true, // Always log errors
};

export default {
  API_CONFIG,
  TIMEOUT_CONFIG,
  RETRY_CONFIG,
  RATE_LIMIT_CONFIG,
  TOKEN_CONFIG,
  HTTP_STATUS,
  DEFAULT_HEADERS,
  DEBUG_CONFIG,
};
