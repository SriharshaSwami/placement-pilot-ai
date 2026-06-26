import mongoose from 'mongoose';

const agentExecutionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  query: {
    type: String,
    required: true
  },
  intent: {
    type: String, // e.g. "RESUME_HELP", "INTERVIEW_PREP"
    required: true
  },
  agentsUsed: [{
    type: String
  }],
  result: {
    type: mongoose.Schema.Types.Mixed, // Can be plain text or JSON depending on agent
    required: true
  },
  latencyMs: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Success', 'Failed'],
    default: 'Success'
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true,
});

const AgentExecution = mongoose.model('AgentExecution', agentExecutionSchema);

export default AgentExecution;
