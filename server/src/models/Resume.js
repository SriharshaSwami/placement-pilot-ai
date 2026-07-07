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
    parentResumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      default: null,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: null,
    },
    tailoringSummary: {
      type: String,
      default: '',
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
          links: [{
            name: { type: String },
            url: { type: String }
          }],
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
          technologies: [{ value: String, confidence: Number }],
          github: { value: String, name: { value: String, confidence: Number }, confidence: Number },
          liveDemo: { value: String, name: { value: String, confidence: Number }, confidence: Number },
          bullets: [{ value: String, confidence: Number }]
        }],
        certifications: [{
          name: { value: String, confidence: Number },
          issuer: { value: String, confidence: Number },
          date: { value: String, confidence: Number },
          url: { value: String, name: { value: String, confidence: Number }, confidence: Number }
        }],
        achievements: [{
          title: { value: String, confidence: Number },
          description: { value: String, confidence: Number },
          url: { value: String, name: { value: String, confidence: Number }, confidence: Number }
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
        }],
        layout: {
          sectionOrder: {
            type: [String],
            default: ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'achievements', 'links']
          }
        }
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
    selectedTemplate: {
      type: String,
      enum: ['classic', 'modern', 'minimal', 'professional'],
      default: 'classic',
    },
    embedding: {
      type: [Number],
      default: null,
    },
    embeddingHash: {
      type: String,
      default: null,
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

// Backward compatibility migration for Project Descriptions and Achievements
const migrateProjectDescriptions = (doc) => {
  if (!doc || !doc.parsedData?.structuredData?.projects) return;
  
  // We use strict: false in schema, or since it's a subdocument it might be available in _doc
  doc.parsedData.structuredData.projects.forEach(proj => {
    const projDoc = proj._doc || proj;
    
    // Initialize bullets if they don't exist
    if (!projDoc.bullets) {
      projDoc.bullets = [];
    }

    // Migrate achievements to bullets
    if (projDoc.achievements && projDoc.achievements.length > 0 && projDoc.bullets.length === 0) {
      projDoc.bullets = [...projDoc.achievements];
    }
    
    // Migrate description to bullets
    if (projDoc.description?.value && projDoc.bullets.length === 0) {
      projDoc.bullets = [{
        value: projDoc.description.value,
        confidence: projDoc.description.confidence || 1
      }];
    }

    // Clean up legacy fields
    projDoc.achievements = undefined;
    projDoc.description = undefined;
  });
};

resumeSchema.post(['find', 'findOne', 'findOneAndUpdate'], function(docs) {
  if (!docs) return;
  if (Array.isArray(docs)) {
    docs.forEach(migrateProjectDescriptions);
  } else {
    migrateProjectDescriptions(docs);
  }
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
