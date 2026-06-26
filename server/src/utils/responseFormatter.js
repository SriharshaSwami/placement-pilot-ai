export const successResponse = (data = {}, message = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (res, statusCode, message, error = null, details = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
    details,
  });
};
