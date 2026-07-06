import interviewRepository from '../repositories/interview.repository.js';
import resumeRepository from '../repositories/resume.repository.js';
import jobRepository from '../repositories/job.repository.js';
import CustomError from '../errors/CustomError.js';
import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { validateSchema } from '../ai/validators/schema.validator.js';
import { buildQuestionPrompt } from '../ai/prompts/interview/question.prompt.js';
import { buildEvaluationPrompt } from '../ai/prompts/interview/evaluation.prompt.js';
import { buildSummaryPrompt } from '../ai/prompts/interview/summary.prompt.js';
import { buildLiveSessionPrompt } from '../ai/prompts/interview/live.prompt.js';
import { interviewQuestionSchema } from '../ai/schemas/interviewQuestion.schema.js';
import { interviewEvaluationSchema } from '../ai/schemas/interviewEvaluation.schema.js';
import { interviewSummarySchema } from '../ai/schemas/interviewSummary.schema.js';
import coachingService from './coaching.service.js';
import embeddingService from './embedding.service.js';

class InterviewService {
  async createSession(userId, configData) {
    const { resumeId, jobId, config } = configData;
    
    // Validate inputs
    if (resumeId) {
      const resume = await resumeRepository.findById(resumeId);
      if (!resume || resume.userId.toString() !== userId.toString()) throw new CustomError('Resume not found', 404);
    }
    if (jobId) {
      const job = await jobRepository.findById(jobId);
      if (!job || job.userId.toString() !== userId.toString()) throw new CustomError('Job not found', 404);
    }

    // A user can only have one active interview session at a time.
    // Clean up/archive any existing active sessions before starting a new one.
    await interviewRepository.archiveAllActiveSessions(userId);

    const session = await interviewRepository.createSession({
      userId,
      resumeId,
      jobId,
      config,
      status: 'InProgress',
      questions: []
    });

    // Generate the very first question immediately
    return this.generateNextQuestion(userId, session._id);
  }

  async getSession(userId, sessionId) {
    const session = await interviewRepository.findById(sessionId);
    if (!session || session.userId.toString() !== userId.toString()) {
      throw new CustomError('Session not found', 404);
    }
    return session;
  }

  async listSessions(userId) {
    // Automatically archive any stale sessions (e.g. abandoned midway) before returning list
    await interviewRepository.archiveStaleSessions(userId);
    return interviewRepository.findByUserId(userId);
  }

  async generateNextQuestion(userId, sessionId) {
    const session = await this.getSession(userId, sessionId);

    if (session.status !== 'InProgress') {
      throw new CustomError('Session is not active', 400);
    }

    const parsedResume = session.resumeId?.parsedData || null;
    const parsedJob = session.jobId || null;
    
    // Adaptive difficulty logic:
    // If the candidate scored well on previous answers, bump up the difficulty.
    // If they struggled, bump it down.
    let adaptiveConfig = { ...session.config };
    if (session.questions.length >= 2) {
      const recentEvals = session.questions.slice(-2).map(q => q.evaluation).filter(Boolean);
      if (recentEvals.length === 2) {
        const avgTechScore = (recentEvals[0].technicalAccuracy + recentEvals[1].technicalAccuracy) / 2;
        if (avgTechScore >= 8) {
           adaptiveConfig.difficulty = adaptiveConfig.difficulty === 'Easy' ? 'Medium' : 'Hard';
        } else if (avgTechScore <= 4) {
           adaptiveConfig.difficulty = adaptiveConfig.difficulty === 'Hard' ? 'Medium' : 'Easy';
        }
      }
    }

    // Optional: Calculate embedding similarity
    let similarityScore = null;
    const resumeDoc = session.resumeId;
    const jobDoc = session.jobId;
    if (resumeDoc?.embedding && jobDoc?.embedding) {
      try {
        const embeddingService = (await import('./embedding.service.js')).default;
        similarityScore = embeddingService.calculateSimilarity(resumeDoc.embedding, jobDoc.embedding);
      } catch (err) {
        console.error('[InterviewService] Failed to calculate similarity:', err.message);
      }
    }

    const promptBuilder = buildQuestionPrompt(adaptiveConfig, parsedResume, parsedJob, session.questions);
    
    let systemInstruction = promptBuilder.getSystemInstruction();
    if (similarityScore !== null) {
      systemInstruction += `\n\nContext: The semantic similarity between the candidate's resume and this job is ${(similarityScore * 100).toFixed(1)}%. Use this context to determine how much to challenge them on skill gaps versus deep-diving into matched skills.`;
    }

    const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
      promptBuilder.buildContent(),
      interviewQuestionSchema,
      systemInstruction
    );

    validateSchema(parsedJSON, interviewQuestionSchema.required);

    // Push new question to session
    session.questions.push({
      sequenceNumber: session.questions.length + 1,
      questionText: parsedJSON.questionText,
      isFollowUp: parsedJSON.isFollowUp,
    });

    return interviewRepository.updateSession(sessionId, { questions: session.questions });
  }

  async submitAnswer(userId, sessionId, questionSequenceNumber, answerText) {
    const session = await this.getSession(userId, sessionId);
    
    if (session.status !== 'InProgress') {
      throw new CustomError('Session is not active', 400);
    }

    const questionIndex = session.questions.findIndex(q => q.sequenceNumber === parseInt(questionSequenceNumber));
    if (questionIndex === -1) {
      throw new CustomError('Question not found', 404);
    }

    const question = session.questions[questionIndex];
    if (question.candidateAnswer) {
      throw new CustomError('Answer already submitted for this question', 400);
    }

    question.candidateAnswer = answerText;

    // Evaluate answer via AI
    const parsedJob = session.jobId || null;
    const promptBuilder = buildEvaluationPrompt(question.questionText, answerText, session.config, parsedJob);
    
    const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
      promptBuilder.buildContent(),
      interviewEvaluationSchema,
      promptBuilder.getSystemInstruction()
    );

    validateSchema(parsedJSON, interviewEvaluationSchema.required);
    
    question.evaluation = parsedJSON;
    
    return interviewRepository.updateSession(sessionId, { questions: session.questions });
  }

  async finishInterview(userId, sessionId) {
    const session = await this.getSession(userId, sessionId);
    
    if (session.status === 'Completed') {
      return session; // already done
    }

    const parsedResume = session.resumeId?.parsedData || null;
    const parsedJob = session.jobId || null;

    const promptBuilder = buildSummaryPrompt(session.config, parsedResume, parsedJob, session.questions);
    
    const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
      promptBuilder.buildContent(),
      interviewSummarySchema,
      promptBuilder.getSystemInstruction()
    );

    validateSchema(parsedJSON, interviewSummarySchema.required);

    // Generate semantic embedding of the summary
    const summaryText = JSON.stringify(parsedJSON);
    const embeddingData = await embeddingService.generateEmbeddingIfChanged(summaryText, session.embeddingHash, {
      userId,
      sourceType: 'Interview',
      sourceId: sessionId
    });

    const updatePayload = {
      status: 'Completed',
      summary: parsedJSON
    };

    if (embeddingData) {
      updatePayload.embedding = embeddingData.embedding;
      updatePayload.embeddingHash = embeddingData.hash;
    }

    const updatedSession = await interviewRepository.updateSession(sessionId, updatePayload);

    // Run deep coaching analysis asynchronously (fire-and-forget for now, or await if preferred)
    coachingService.generateCoachingReport(updatedSession).catch(err => {
      console.error("[InterviewService] Async coaching generation failed:", err);
    });

    return updatedSession;
  }

  async getLiveSessionPrompt(userId, sessionId) {
    const session = await this.getSession(userId, sessionId);
    if (session.status !== 'InProgress') {
      throw new CustomError('Session is not active', 400);
    }
    const parsedResume = session.resumeId?.parsedData || null;
    const parsedJob = session.jobId || null;
    
    const promptBuilder = buildLiveSessionPrompt(session.config, parsedResume, parsedJob, session.questions);
    return promptBuilder.buildContent();
  }

  async evaluateAndSaveLiveTurn(userId, sessionId, questionText, answerText) {
    if (!questionText || !answerText) return; // Need both to evaluate
    const session = await this.getSession(userId, sessionId);
    if (session.status !== 'InProgress') return;

    try {
      const parsedJob = session.jobId || null;
      const promptBuilder = buildEvaluationPrompt(questionText, answerText, session.config, parsedJob);
      
      const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
        promptBuilder.buildContent(),
        interviewEvaluationSchema,
        promptBuilder.getSystemInstruction()
      );

      validateSchema(parsedJSON, interviewEvaluationSchema.required);
      
      session.questions.push({
        sequenceNumber: session.questions.length + 1,
        questionText,
        candidateAnswer: answerText,
        evaluation: parsedJSON,
      });
      
      await interviewRepository.updateSession(sessionId, { questions: session.questions });
    } catch (err) {
      console.error("[InterviewService] Failed to evaluate live turn:", err);
    }
  }
}

export default new InterviewService();
