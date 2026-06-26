import mongoose from 'mongoose';

const knowledgeMetadataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  documentId: {
    type: String,
    required: true
  },
  documentType: {
    type: String,
    enum: ['Resume', 'ResumeAnalysis', 'JobDescription', 'InterviewSession', 'CodingSession', 'CareerRoadmap', 'UserNotes'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Indexing', 'Indexed', 'Failed'],
    default: 'Pending'
  },
  chunkCount: { type: Number, default: 0 },
  version: { type: Number, default: 1 },
  errorMessage: { type: String }
}, {
  timestamps: true,
});

// Compound index for quick lookups
knowledgeMetadataSchema.index({ userId: 1, documentId: 1, documentType: 1 }, { unique: true });

const KnowledgeMetadata = mongoose.model('KnowledgeMetadata', knowledgeMetadataSchema);

export default KnowledgeMetadata;
