import Job from '../models/Job.js';

class JobRepository {
  async create(jobData) {
    const job = new Job(jobData);
    return job.save();
  }

  async findByUserId(userId, options = {}) {
    const query = { userId, ...options };
    return Job.find(query).sort({ createdAt: -1 });
  }

  async findById(id) {
    return Job.findById(id);
  }

  async updateById(id, updateData) {
    return Job.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return Job.findByIdAndDelete(id);
  }
}

export default new JobRepository();
