// libs imports
import Joi from "joi";

export const joi = Joi.defaults((schemas) =>
  schemas.options({
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
    errors: {
      wrap: {
        label: false,
      },
    },
  }),
);
