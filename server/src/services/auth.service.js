import CustomError from '../errors/CustomError.js';
import userRepository from '../repositories/user.repository.js';
import { generateToken } from '../utils/jwtUtils.js';

class AuthService {
  async register({ name, email, password }) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError('User already exists', 400, 'USER_EXISTS');
    }

    // Create user (password hash is handled by Mongoose pre-save hook)
    const user = await userRepository.create({
      name,
      email,
      passwordHash: password,
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user without password
    const userObject = user.toObject();
    delete userObject.passwordHash;

    return { user: userObject, token };
  }

  async login({ email, password }) {
    // Check for user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new CustomError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user without password
    const userObject = user.toObject();
    delete userObject.passwordHash;

    return { user: userObject, token };
  }
}

export default new AuthService();
