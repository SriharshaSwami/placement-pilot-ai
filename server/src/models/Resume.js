import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'My Resume',
    },
    originalFilename: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    parsedData: {
      rawText: String,
      cleanedText: String,
      sections: {
        type: Map,
        of: String,
      },
      structuredData: {
        candidate: {
          name: { value: String, confidence: Number },
          email: { value: String, confidence: Number },
          phone: { value: String, confidence: Number },
          linkedin: { value: String, confidence: Number },
          github: { value: String, confidence: Number },
          portfolio: { value: String, confidence: Number },
          location: { value: String, confidence: Number },
        },
        professionalSummary: { value: String, confidence: Number },
        skills: {
          languages: [{ value: String, confidence: Number }],
          frameworks: [{ value: String, confidence: Number }],
          libraries: [{ value: String, confidence: Number }],
          databases: [{ value: String, confidence: Number }],
          cloud: [{ value: String, confidence: Number }],
          devOps: [{ value: String, confidence: Number }],
          tools: [{ value: String, confidence: Number }],
          aiML: [{ value: String, confidence: Number }],
          other: [{ value: String, confidence: Number }]
        },
        education: [{
          institution: { value: String, confidence: Number },
          degree: { value: String, confidence: Number },
          specialization: { value: String, confidence: Number },
          startDate: { value: String, confidence: Number },
          endDate: { value: String, confidence: Number },
          cgpa: { value: String, confidence: Number },
          percentage: { value: String, confidence: Number },
          location: { value: String, confidence: Number }
        }],
        experience: [{
          company: { value: String, confidence: Number },
          role: { value: String, confidence: Number },
          employmentType: { value: String, confidence: Number },
          startDate: { value: String, confidence: Number },
          endDate: { value: String, confidence: Number },
          duration: { value: String, confidence: Number },
          location: { value: String, confidence: Number },
          responsibilities: [{ value: String, confidence: Number }],
          technologies: [{ value: String, confidence: Number }]
        }],
        projects: [{
          title: { value: String, confidence: Number },
          description: { value: String, confidence: Number },
          technologies: [{ value: String, confidence: Number }],
          github: { value: String, confidence: Number },
          liveDemo: { value: String, confidence: Number },
          achievements: [{ value: String, confidence: Number }]
        }],
        certifications: [{
          name: { value: String, confidence: Number },
          issuer: { value: String, confidence: Number },
          date: { value: String, confidence: Number },
          url: { value: String, confidence: Number }
        }],
        achievements: [{
          title: { value: String, confidence: Number },
          description: { value: String, confidence: Number }
        }],
        leadership: [{
          role: { value: String, confidence: Number },
          organization: { value: String, confidence: Number },
          description: { value: String, confidence: Number }
        }],
        publications: [{
          title: { value: String, confidence: Number },
          publisher: { value: String, confidence: Number },
          date: { value: String, confidence: Number },
          url: { value: String, confidence: Number }
        }],
        openSource: [{
          project: { value: String, confidence: Number },
          description: { value: String, confidence: Number },
          url: { value: String, confidence: Number }
        }],
        hackathons: [{
          name: { value: String, confidence: Number },
          role: { value: String, confidence: Number },
          description: { value: String, confidence: Number },
          date: { value: String, confidence: Number }
        }],
        codingProfiles: [{
          platform: { value: String, confidence: Number },
          username: { value: String, confidence: Number },
          url: { value: String, confidence: Number }
        }],
        languagesSpoken: [{
          language: { value: String, confidence: Number },
          proficiency: { value: String, confidence: Number }
        }]
      },
      metadata: {
        parsingStatus: {
          type: String,
          enum: ['pending', 'success', 'failed'],
          default: 'pending',
        },
        sectionCount: Number,
        extractedCharacterCount: Number,
        parserVersion: String,
        extractionTimestamp: Date,
        failureReason: String,
      },
      aiMetadata: {
        aiModel: String,
        promptVersion: String,
        processingTimeMs: Number,
        averageConfidence: Number,
      }
    },
    uploadStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
resumeSchema.index({ userId: 1 });
resumeSchema.index({ userId: 1, isPrimary: 1 });
resumeSchema.index({ userId: 1, deletedAt: 1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
