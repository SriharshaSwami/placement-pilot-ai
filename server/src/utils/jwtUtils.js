import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};
