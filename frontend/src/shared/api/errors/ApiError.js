/**
 * API Error Classes
 * Custom error hierarchy for precise error handling
 *
 * Inheritance:
 * Error
 *  └── ApiError (base)
 *       ├── NetworkError (connection issues)
 *       ├── TimeoutError (request timeout)
 *       ├── AuthError (401/403)
 *       ├── ValidationError (400/422)
 *       ├── NotFoundError (404)
 *       ├── RateLimitError (429)
 *       └── ServerError (5xx)
 */

import { HTTP_STATUS } from "../../config/api.config.js";

/**
 * Base API Error
 */
export class ApiError extends Error {
  constructor(message, statusCode = null, data = null, originalError = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
    this.isApiError = true;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Network Error - No connection, DNS failure, etc.
 */
export class NetworkError extends ApiError {
  constructor(message = "Network connection failed", originalError = null) {
    super(message, null, null, originalError);
    this.name = "NetworkError";
    this.isNetworkError = true;
    this.isRetryable = true;
  }
}

/**
 * Timeout Error - Request exceeded time limit
 */
export class TimeoutError extends ApiError {
  constructor(
    message = "Request timed out",
    timeout = null,
    originalError = null
  ) {
    super(message, null, { timeout }, originalError);
    this.name = "TimeoutError";
    this.timeout = timeout;
    this.isTimeoutError = true;
    this.isRetryable = true;
  }
}

/**
 * Authentication Error - 401 Unauthorized
 */
export class AuthError extends ApiError {
  constructor(
    message = "Authentication required",
    data = null,
    originalError = null
  ) {
    super(message, HTTP_STATUS.UNAUTHORIZED, data, originalError);
    this.name = "AuthError";
    this.isAuthError = true;
    this.isRetryable = false;
  }
}

/**
 * Forbidden Error - 403 Forbidden
 */
export class ForbiddenError extends ApiError {
  constructor(message = "Access forbidden", data = null, originalError = null) {
    super(message, HTTP_STATUS.FORBIDDEN, data, originalError);
    this.name = "ForbiddenError";
    this.isForbiddenError = true;
    this.isRetryable = false;
  }
}

/**
 * Validation Error - 400/422 Bad Request
 */
export class ValidationError extends ApiError {
  constructor(
    message = "Validation failed",
    errors = {},
    originalError = null
  ) {
    super(message, HTTP_STATUS.BAD_REQUEST, { errors }, originalError);
    this.name = "ValidationError";
    this.errors = errors;
    this.isValidationError = true;
    this.isRetryable = false;
  }

  /**
   * Get field-specific error message
   */
  getFieldError(field) {
    return this.errors[field] || null;
  }
}

/**
 * Not Found Error - 404
 */
export class NotFoundError extends ApiError {
  constructor(
    message = "Resource not found",
    resource = null,
    originalError = null
  ) {
    super(message, HTTP_STATUS.NOT_FOUND, { resource }, originalError);
    this.name = "NotFoundError";
    this.resource = resource;
    this.isNotFoundError = true;
    this.isRetryable = false;
  }
}

/**
 * Conflict Error - 409
 */
export class ConflictError extends ApiError {
  constructor(
    message = "Resource conflict",
    data = null,
    originalError = null
  ) {
    super(message, HTTP_STATUS.CONFLICT, data, originalError);
    this.name = "ConflictError";
    this.isConflictError = true;
    this.isRetryable = false;
  }
}

/**
 * Rate Limit Error - 429 Too Many Requests
 */
export class RateLimitError extends ApiError {
  constructor(
    message = "Too many requests",
    retryAfter = null,
    originalError = null
  ) {
    super(
      message,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      { retryAfter },
      originalError
    );
    this.name = "RateLimitError";
    this.retryAfter = retryAfter; // seconds until retry allowed
    this.isRateLimitError = true;
    this.isRetryable = true;
  }
}

/**
 * Server Error - 5xx errors
 */
export class ServerError extends ApiError {
  constructor(
    message = "Server error",
    statusCode = 500,
    data = null,
    originalError = null
  ) {
    super(message, statusCode, data, originalError);
    this.name = "ServerError";
    this.isServerError = true;
    this.isRetryable = true;
  }
}

/**
 * Request Cancelled Error - User/system cancelled
 */
export class CancelledError extends ApiError {
  constructor(message = "Request cancelled", originalError = null) {
    super(message, null, null, originalError);
    this.name = "CancelledError";
    this.isCancelledError = true;
    this.isRetryable = false;
  }
}

/**
 * Error Factory - Creates appropriate error from response
 */
export function createApiError(error, response = null) {
  // Already an ApiError
  if (error?.isApiError) {
    return error;
  }

  // Request cancelled
  if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
    return new CancelledError("Request was cancelled", error);
  }

  // Network error (no response)
  if (error?.code === "ERR_NETWORK" || !response) {
    return new NetworkError("Unable to connect to server", error);
  }

  // Timeout
  if (error?.code === "ECONNABORTED" || error?.message?.includes("timeout")) {
    return new TimeoutError("Request timed out", error?.config?.timeout, error);
  }

  const status = response?.status;
  const data = response?.data;
  const message = data?.message || error?.message || "An error occurred";

  switch (status) {
    case HTTP_STATUS.UNAUTHORIZED:
      return new AuthError(message, data, error);

    case HTTP_STATUS.FORBIDDEN:
      return new ForbiddenError(message, data, error);

    case HTTP_STATUS.NOT_FOUND:
      return new NotFoundError(message, null, error);

    case HTTP_STATUS.CONFLICT:
      return new ConflictError(message, data, error);

    case HTTP_STATUS.BAD_REQUEST:
    case HTTP_STATUS.UNPROCESSABLE_ENTITY:
      return new ValidationError(message, data?.errors || {}, error);

    case HTTP_STATUS.TOO_MANY_REQUESTS:
      return new RateLimitError(
        message,
        response?.headers?.["retry-after"],
        error
      );

    case HTTP_STATUS.INTERNAL_SERVER_ERROR:
    case HTTP_STATUS.BAD_GATEWAY:
    case HTTP_STATUS.SERVICE_UNAVAILABLE:
    case HTTP_STATUS.GATEWAY_TIMEOUT:
      return new ServerError(message, status, data, error);

    default:
      return new ApiError(message, status, data, error);
  }
}

export default {
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
};
