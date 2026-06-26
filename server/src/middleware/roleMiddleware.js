import CustomError from '../errors/CustomError.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new CustomError('Not authorized', 401, 'UNAUTHORIZED'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new CustomError('Not authorized to access this resource', 403, 'FORBIDDEN'));
    }
    next();
  };
};
