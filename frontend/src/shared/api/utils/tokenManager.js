/**
 * Token Manager
 * Centralized token storage and management
 *
 * Features:
 * - Secure token storage (memory + localStorage fallback)
 * - Token expiry detection
 * - Automatic cleanup
 * - Cross-tab synchronization
 */

import { TOKEN_CONFIG } from "../../config/api.config.js";

// In-memory token store (primary - more secure)
let memoryTokens = {
  accessToken: null,
  refreshToken: null,
};

// Check if localStorage is available
const isLocalStorageAvailable = (() => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
})();

/**
 * Parse JWT token to extract payload
 */
function parseJwt(token) {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Token Manager Class
 */
class TokenManager {
  constructor() {
    this.listeners = new Set();
    this._initFromStorage();
    this._setupStorageListener();
  }

  /**
   * Initialize tokens from storage (hydration)
   */
  _initFromStorage() {
    if (!isLocalStorageAvailable) return;

    const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);

    if (accessToken && !this.isTokenExpired(accessToken)) {
      memoryTokens.accessToken = accessToken;
    } else if (accessToken) {
      // Expired - clear from storage
      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    }

    if (refreshToken) {
      memoryTokens.refreshToken = refreshToken;
    }
  }

  /**
   * Cross-tab synchronization
   */
  _setupStorageListener() {
    if (typeof window === "undefined") return;

    window.addEventListener("storage", (event) => {
      if (event.key === TOKEN_CONFIG.ACCESS_TOKEN_KEY) {
        memoryTokens.accessToken = event.newValue;
        this._notifyListeners("accessToken", event.newValue);
      }
      if (event.key === TOKEN_CONFIG.REFRESH_TOKEN_KEY) {
        memoryTokens.refreshToken = event.newValue;
        this._notifyListeners("refreshToken", event.newValue);
      }
    });
  }

  /**
   * Notify listeners of token changes
   */
  _notifyListeners(type, value) {
    this.listeners.forEach((listener) => {
      try {
        listener(type, value);
      } catch (error) {
        console.error("Token listener error:", error);
      }
    });
  }

  /**
   * Subscribe to token changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // ==================== ACCESS TOKEN ====================

  /**
   * Get access token
   */
  getAccessToken() {
    return memoryTokens.accessToken;
  }

  /**
   * Set access token
   */
  setAccessToken(token) {
    memoryTokens.accessToken = token;

    if (isLocalStorageAvailable && token) {
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, token);
    }

    this._notifyListeners("accessToken", token);
  }

  /**
   * Get authorization header value
   */
  getAuthHeader() {
    const token = this.getAccessToken();
    return token ? `${TOKEN_CONFIG.TOKEN_TYPE} ${token}` : null;
  }

  // ==================== REFRESH TOKEN ====================

  /**
   * Get refresh token
   */
  getRefreshToken() {
    return memoryTokens.refreshToken;
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token) {
    memoryTokens.refreshToken = token;

    if (isLocalStorageAvailable && token) {
      localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, token);
    }

    this._notifyListeners("refreshToken", token);
  }

  // ==================== TOKEN OPERATIONS ====================

  /**
   * Set both tokens at once
   */
  setTokens(accessToken, refreshToken) {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  /**
   * Clear all tokens (logout)
   */
  clearTokens() {
    memoryTokens = { accessToken: null, refreshToken: null };

    if (isLocalStorageAvailable) {
      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    }

    this._notifyListeners("cleared", null);
  }

  /**
   * Check if user has valid tokens
   */
  hasTokens() {
    return !!memoryTokens.accessToken || !!memoryTokens.refreshToken;
  }

  /**
   * Check if access token exists and is valid
   */
  hasValidAccessToken() {
    const token = this.getAccessToken();
    return token && !this.isTokenExpired(token);
  }

  // ==================== TOKEN VALIDATION ====================

  /**
   * Check if token is expired
   */
  isTokenExpired(token) {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;

    // Add threshold buffer
    const expiryTime = payload.exp * 1000;
    const now = Date.now();

    return now >= expiryTime - TOKEN_CONFIG.REFRESH_THRESHOLD;
  }

  /**
   * Check if access token needs refresh
   */
  needsRefresh() {
    const token = this.getAccessToken();
    return token && this.isTokenExpired(token) && this.getRefreshToken();
  }

  /**
   * Get token expiry time (ms)
   */
  getTokenExpiry(token = null) {
    const targetToken = token || this.getAccessToken();
    const payload = parseJwt(targetToken);
    return payload?.exp ? payload.exp * 1000 : null;
  }

  /**
   * Get time until token expires (ms)
   */
  getTimeUntilExpiry() {
    const expiry = this.getTokenExpiry();
    if (!expiry) return 0;
    return Math.max(0, expiry - Date.now());
  }

  /**
   * Get user info from token
   */
  getTokenPayload() {
    return parseJwt(this.getAccessToken());
  }
}

// Singleton instance
export const tokenManager = new TokenManager();

export default tokenManager;
