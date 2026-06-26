import User from '../models/User.js';

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email }).select('+passwordHash');
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async updateById(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }
}

export default new UserRepository();
