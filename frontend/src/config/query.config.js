/**
 * TanStack Query Configuration
 * Enterprise-grade query client setup
 *
 * Features:
 * - Optimized stale/cache times
 * - Smart retry logic
 * - Error handling integration
 * - Devtools configuration
 */

import { QueryClient } from "@tanstack/react-query";
import { ApiError, NetworkError, AuthError } from "../shared/api/index.js";

/**
 * Default query options
 */
const defaultQueryOptions = {
  queries: {
    // Data freshness
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime)

    // Retry logic
    retry: (failureCount, error) => {
      // Don't retry auth errors
      if (error instanceof AuthError) return false;

      // Don't retry 4xx errors (except 429)
      if (
        error?.statusCode >= 400 &&
        error?.statusCode < 500 &&
        error?.statusCode !== 429
      ) {
        return false;
      }

      // Retry up to 2 times for network/server errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Refetch behavior
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  },

  mutations: {
    // Don't retry mutations by default
    retry: false,
  },
};

/**
 * Create query client instance
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: defaultQueryOptions,
  });
}

/**
 * Query key factory helpers
 * Ensures consistent query key structure
 */
export const queryKeys = {
  // Auth
  auth: {
    all: ["auth"],
    user: () => [...queryKeys.auth.all, "user"],
    session: () => [...queryKeys.auth.all, "session"],
  },

  // Articles
  articles: {
    all: ["articles"],
    lists: () => [...queryKeys.articles.all, "list"],
    list: (filters) => [...queryKeys.articles.lists(), filters],
    details: () => [...queryKeys.articles.all, "detail"],
    detail: (slug) => [...queryKeys.articles.details(), slug],
    byAuthor: (username) => [...queryKeys.articles.all, "author", username],
    byTag: (tag) => [...queryKeys.articles.all, "tag", tag],
    my: (filters) => [...queryKeys.articles.all, "my", filters],
  },

  // Users
  users: {
    all: ["users"],
    profile: (username) => [...queryKeys.users.all, "profile", username],
    me: () => [...queryKeys.users.all, "me"],
  },

  // Topics (Phase 2)
  topics: {
    all: ["topics"],
    list: () => [...queryKeys.topics.all, "list"],
    detail: (slug) => [...queryKeys.topics.all, "detail", slug],
  },

  // Search (Phase 2)
  search: {
    all: ["search"],
    results: (query) => [...queryKeys.search.all, "results", query],
    suggestions: (query) => [...queryKeys.search.all, "suggestions", query],
  },
};

/**
 * Invalidation helpers
 */
export const queryInvalidation = {
  articles: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
  },
  articleDetail: (queryClient, slug) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.articles.detail(slug),
    });
  },
  myArticles: (queryClient) => {
    queryClient.invalidateQueries({
      queryKey: [...queryKeys.articles.all, "my"],
    });
  },
  user: (queryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users.me() });
  },
};

// Singleton instance
let queryClient = null;

export function getQueryClient() {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}

export default {
  createQueryClient,
  getQueryClient,
  queryKeys,
  queryInvalidation,
};
