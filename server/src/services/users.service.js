import CustomError from '../errors/CustomError.js';
import userRepository from '../repositories/user.repository.js';

class UsersService {
  async getUserProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404, 'NOT_FOUND');
    }
    return user;
  }

  async updateUserProfile(userId, updateData) {
    const user = await userRepository.updateById(userId, updateData);
    if (!user) {
      throw new CustomError('User not found', 404, 'NOT_FOUND');
    }
    return user;
  }
}

export default new UsersService();
