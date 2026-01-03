/**
 * Request Cancel Manager
 * Manages AbortControllers for request cancellation
 *
 * Use Cases:
 * 1. Cancel pending requests on route change
 * 2. Cancel duplicate requests (debouncing)
 * 3. Cancel stale requests (race conditions)
 * 4. User-initiated cancellation
 */

class CancelManager {
  constructor() {
    // Map of request key -> AbortController
    this.controllers = new Map();
  }

  /**
   * Generate unique key for request
   */
  generateKey(config) {
    const { method = "GET", url, params } = config;
    const paramString = params ? JSON.stringify(params) : "";
    return `${method}:${url}:${paramString}`;
  }

  /**
   * Create or get AbortController for request
   * Automatically cancels previous request with same key
   */
  getController(config, cancelPrevious = false) {
    const key = this.generateKey(config);

    // Cancel previous request with same key if requested
    if (cancelPrevious && this.controllers.has(key)) {
      this.cancel(key, "Superseded by new request");
    }

    // Create new controller
    const controller = new AbortController();
    this.controllers.set(key, controller);

    return {
      key,
      signal: controller.signal,
      controller,
    };
  }

  /**
   * Register an existing request with its key
   */
  register(key, controller) {
    this.controllers.set(key, controller);
  }

  /**
   * Cancel specific request by key
   */
  cancel(key, reason = "Request cancelled") {
    const controller = this.controllers.get(key);
    if (controller) {
      controller.abort(reason);
      this.controllers.delete(key);
      return true;
    }
    return false;
  }

  /**
   * Cancel all pending requests
   */
  cancelAll(reason = "All requests cancelled") {
    this.controllers.forEach((controller) => {
      controller.abort(reason);
    });
    this.controllers.clear();
  }

  /**
   * Cancel requests matching pattern
   */
  cancelMatching(pattern, reason = "Matching requests cancelled") {
    const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;

    this.controllers.forEach((controller, key) => {
      if (regex.test(key)) {
        controller.abort(reason);
        this.controllers.delete(key);
      }
    });
  }

  /**
   * Remove controller (called after request completes)
   */
  remove(key) {
    this.controllers.delete(key);
  }

  /**
   * Check if request is pending
   */
  isPending(key) {
    return this.controllers.has(key);
  }

  /**
   * Get count of pending requests
   */
  pendingCount() {
    return this.controllers.size;
  }

  /**
   * Get all pending request keys
   */
  getPendingKeys() {
    return Array.from(this.controllers.keys());
  }
}

// Singleton instance
export const cancelManager = new CancelManager();

export default cancelManager;
