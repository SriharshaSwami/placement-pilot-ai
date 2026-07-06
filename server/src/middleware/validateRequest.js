import CustomError from '../errors/CustomError.js';

const validateRequest = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const messages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return next(new CustomError(messages, 422, 'VALIDATION_ERROR', error.issues));
    }
    return next(error);
  }
};

export default validateRequest;
