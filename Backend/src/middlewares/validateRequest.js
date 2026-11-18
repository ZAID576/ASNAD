import { errorResponse } from '../utils/response.js';

export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;

    next();
  } catch (error) {
    const details = error.errors?.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })) || error.message;

    return errorResponse(res, 'Validation failed', 'VALIDATION_ERROR', 400, details);
  }
};
