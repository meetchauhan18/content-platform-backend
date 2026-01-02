// Token expiration times (in milliseconds)
export const TOKEN_EXPIRY = {
  EMAIL_VERIFICATION: 10 * 60 * 1000, // 10 minutes
  PASSWORD_RESET: 10 * 60 * 1000, // 10 minutes
  ACCESS_TOKEN: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_DEFAULT: 7 * 24 * 60 * 60 * 1000, // 7 days
  REFRESH_TOKEN_REMEMBER: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// Content limits
export const CONTENT_LIMITS = {
  TITLE_MAX: 200,
  SUBTITLE_MAX: 300,
  BIO_MAX: 300,
  EXCERPT_MAX: 300,
  TAG_MAX_LENGTH: 30,
  TAGS_MAX_COUNT: 10,
  ALT_TEXT_MAX: 200,
};

// Reading speed (words per minute)
export const READING_SPEED_WPM = 200;

// Article status enum
export const ARTICLE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
  UNLISTED: "unlisted",
};

// Content block types
export const CONTENT_BLOCK_TYPES = [
  "paragraph",
  "heading",
  "code",
  "image",
  "quote",
  "list",
  "callout",
  "divider",
  "embed",
];

// Sort options for articles
export const ARTICLE_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "publishedAt",
  "stats.views",
];

export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
};
