import AppError from "../utils/app-error.js";

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.validatedData = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error) {
      return next(
        new AppError(
          error.issues?.[0]?.message || "Validation failed",
          400
        )
      );
    }
  };
};

export default validate;