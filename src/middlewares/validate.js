const validate = (schema) => {
  console.log("🚀 ~ validate ~ schema:", schema);
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    console.log("🚀 ~ validate ~ value:", value);
    console.log("🚀 ~ validate ~ error:", error);

    if (error) {
      const errors = error?.details.map((detail) => detail?.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    next();
  };
};

export default validate;
