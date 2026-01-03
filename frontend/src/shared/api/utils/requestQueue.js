/**
 * Request Queue Manager
 * Queues requests during token refresh to prevent race conditions
 *
 * Problem Solved:
 * When access token expires, multiple simultaneous requests might all try
 * to refresh the token. This creates race conditions and wasted API calls.
 *
 * Solution:
 * 1. First request initiates token refresh
 * 2. Subsequent requests are queued
 * 3. Once refresh completes, all queued requests are replayed
 * 4. If refresh fails, all queued requests are rejected
 */

class RequestQueue {
  constructor() {
    this.isRefreshing = false;
    this.queue = [];
  }

  /**
   * Add request to queue
   * @returns {Promise} Resolves when token is refreshed
   */
  enqueue() {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject });
    });
  }

  /**
   * Mark refresh as in progress
   */
  startRefresh() {
    this.isRefreshing = true;
  }

  /**
   * Check if refresh is in progress
   */
  isRefreshInProgress() {
    return this.isRefreshing;
  }

  /**
   * Resolve all queued requests with new token
   */
  resolveAll(token) {
    this.isRefreshing = false;
    const currentQueue = [...this.queue];
    this.queue = [];

    currentQueue.forEach(({ resolve }) => {
      resolve(token);
    });
  }

  /**
   * Reject all queued requests with error
   */
  rejectAll(error) {
    this.isRefreshing = false;
    const currentQueue = [...this.queue];
    this.queue = [];

    currentQueue.forEach(({ reject }) => {
      reject(error);
    });
  }

  /**
   * Get queue size
   */
  size() {
    return this.queue.length;
  }

  /**
   * Clear queue without resolving/rejecting
   */
  clear() {
    this.isRefreshing = false;
    this.queue = [];
  }
}

// Singleton instance
export const requestQueue = new RequestQueue();

export default requestQueue;
