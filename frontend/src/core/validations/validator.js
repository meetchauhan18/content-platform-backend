// core/validations/validator.js
import { normalizeError } from "@/shared/utils/normalizeError.js";

// validateSchema payload/data incoming from  request and response 
export function validateSchema(schema, payload, options = {}) {
  return schema.validate(payload, {
    abortEarly: false,
    allowUnknown: true,
    ...options,
  });
}

// validate request payload data for baseservice
export function validateRequest(schema, payload) {
  if (!schema) return payload;
  const { error, value } = validateSchema(schema, payload, { allowUnknown: false });
  if (!error) return value;

  throw normalizeError({
    status: 400,
    message: "Invalid request payload",
    code: "REQUEST_VALIDATION_ERROR",
    details: {
      fields: error?.details.map((detail) => ({
        path: detail.path.join("."),
        type: detail.type,
        message: detail.message,
      })),
    },
  });
}

//  validate response payload data for baseservice
export function validateResponse(schema, payload) {
  if (!schema) return payload;
  const { error, value } = validateSchema(schema, payload, { allowUnknown: true });
  if (!error) return value;

  throw normalizeError({
    status: 500,
    message: "Invalid response from server",
    code: "RESPONSE_VALIDATION_ERROR",
    details: {
      fields: error?.details.map((detail) => ({
        path: detail.path.join("."),
        type: detail.type,
        message: detail.message,
      })),
    },
  });
}
