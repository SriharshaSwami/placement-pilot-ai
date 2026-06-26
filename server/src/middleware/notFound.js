import { errorResponse } from '../utils/responseFormatter.js';

const notFound = (req, res, next) => {
  return errorResponse(res, 404, `Not Found - ${req.originalUrl}`, 'ROUTE_NOT_FOUND');
};

export default notFound;
