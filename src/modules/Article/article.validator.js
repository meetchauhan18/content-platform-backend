import Joi from "joi";
import {
  CONTENT_LIMITS,
  PAGINATION,
  ARTICLE_STATUS,
  CONTENT_BLOCK_TYPES,
  ARTICLE_SORT_FIELDS,
  SORT_ORDER,
} from "../../shared/constants/index.js";

// MongoDB ObjectId pattern
const objectIdPattern = /^[a-f\d]{24}$/i;

// Slug pattern (lowercase alphanumeric with hyphens)
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ========== REQUEST BODY SCHEMAS ==========

/**
 * Schema for creating a new article
 */
export const createArticleSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(CONTENT_LIMITS.TITLE_MAX)
    .required()
    .messages({
      "string.empty": "Title is required",
      "string.max": `Title must not exceed ${CONTENT_LIMITS.TITLE_MAX} characters`,
    }),
  subtitle: Joi.string()
    .trim()
    .max(CONTENT_LIMITS.SUBTITLE_MAX)
    .optional()
    .allow(""),
  content: Joi.array()
    .items(
      Joi.object({
        blockId: Joi.string().required(),
        type: Joi.string()
          .valid(...CONTENT_BLOCK_TYPES)
          .required(),
        data: Joi.any().optional(),
        order: Joi.number().integer().optional(),
      })
    )
    .optional()
    .default([]),
  tags: Joi.array()
    .items(Joi.string().trim().lowercase().max(CONTENT_LIMITS.TAG_MAX_LENGTH))
    .max(CONTENT_LIMITS.TAGS_MAX_COUNT)
    .optional()
    .default([]),
  coverImage: Joi.object({
    url: Joi.string().uri().optional(),
    alt: Joi.string().max(CONTENT_LIMITS.ALT_TEXT_MAX).optional(),
  }).optional(),
}).strict();

/**
 * Schema for updating an article (all fields optional)
 */
export const updateArticleSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(CONTENT_LIMITS.TITLE_MAX)
    .optional()
    .messages({
      "string.empty": "Title cannot be empty",
      "string.max": `Title must not exceed ${CONTENT_LIMITS.TITLE_MAX} characters`,
    }),
  subtitle: Joi.string()
    .trim()
    .max(CONTENT_LIMITS.SUBTITLE_MAX)
    .optional()
    .allow(""),
  content: Joi.array()
    .items(
      Joi.object({
        blockId: Joi.string().required(),
        type: Joi.string()
          .valid(...CONTENT_BLOCK_TYPES)
          .required(),
        data: Joi.any().optional(),
        order: Joi.number().integer().optional(),
      })
    )
    .optional(),
  tags: Joi.array()
    .items(Joi.string().trim().lowercase().max(CONTENT_LIMITS.TAG_MAX_LENGTH))
    .max(CONTENT_LIMITS.TAGS_MAX_COUNT)
    .optional(),
  coverImage: Joi.object({
    url: Joi.string().uri().optional(),
    alt: Joi.string().max(CONTENT_LIMITS.ALT_TEXT_MAX).optional(),
  }).optional(),
})
  .min(1) // At least one field must be provided
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// ========== PARAM SCHEMAS ==========

/**
 * Schema for validating article ID param
 */
export const articleIdParamSchema = Joi.object({
  id: Joi.string().pattern(objectIdPattern).required().messages({
    "string.pattern.base": "Invalid article ID format",
  }),
});

/**
 * Schema for validating slug param
 */
export const slugParamSchema = Joi.object({
  slug: Joi.string().pattern(slugPattern).required().messages({
    "string.pattern.base": "Invalid slug format",
  }),
});

/**
 * Schema for validating username param
 */
export const usernameParamSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required().messages({
    "string.min": "Invalid username",
    "string.max": "Invalid username",
  }),
});

/**
 * Schema for validating tag param
 */
export const tagParamSchema = Joi.object({
  tag: Joi.string()
    .trim()
    .lowercase()
    .max(CONTENT_LIMITS.TAG_MAX_LENGTH)
    .required()
    .messages({
      "string.max": "Invalid tag",
    }),
});

// ========== QUERY SCHEMAS ==========

/**
 * Schema for pagination and sorting query params
 */
export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(PAGINATION.MAX_LIMIT)
    .default(PAGINATION.DEFAULT_LIMIT),
  sortBy: Joi.string()
    .valid(...ARTICLE_SORT_FIELDS)
    .default("createdAt"),
  sortOrder: Joi.string()
    .valid(SORT_ORDER.ASC, SORT_ORDER.DESC)
    .default(SORT_ORDER.DESC),
  status: Joi.string()
    .valid(
      ARTICLE_STATUS.DRAFT,
      ARTICLE_STATUS.PUBLISHED,
      ARTICLE_STATUS.ARCHIVED,
      ARTICLE_STATUS.UNLISTED
    )
    .optional(),
  tag: Joi.string()
    .trim()
    .lowercase()
    .max(CONTENT_LIMITS.TAG_MAX_LENGTH)
    .optional(),
});

// Default export for backward compatibility
export default {
  createArticleSchema,
  updateArticleSchema,
  articleIdParamSchema,
  slugParamSchema,
  usernameParamSchema,
  tagParamSchema,
  paginationQuerySchema,
};
