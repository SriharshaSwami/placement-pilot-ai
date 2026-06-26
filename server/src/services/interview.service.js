import interviewRepository from '../repositories/interview.repository.js';
import resumeRepository from '../repositories/resume.repository.js';
import jobRepository from '../repositories/job.repository.js';
import CustomError from '../errors/CustomError.js';
import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { validateSchema } from '../ai/validators/schema.validator.js';
import { buildQuestionPrompt } from '../ai/prompts/interview/question.prompt.js';
import { buildEvaluationPrompt } from '../ai/prompts/interview/evaluation.prompt.js';
import { buildSummaryPrompt } from '../ai/prompts/interview/summary.prompt.js';
import { interviewQuestionSchema } from '../ai/schemas/interviewQuestion.schema.js';
import { interviewEvaluationSchema } from '../ai/schemas/interviewEvaluation.schema.js';
import { interviewSummarySchema } from '../ai/schemas/interviewSummary.schema.js';

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
    return interviewRepository.findByUserId(userId);
  }

  async generateNextQuestion(userId, sessionId) {
    const session = await this.getSession(userId, sessionId);

    if (session.status !== 'InProgress') {
      throw new CustomError('Session is not active', 400);
    }

    const parsedResume = session.resumeId?.parsedData || null;
    const parsedJob = session.jobId || null;

    const promptBuilder = buildQuestionPrompt(session.config, parsedResume, parsedJob, session.questions);
    
    const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
      promptBuilder.buildContent(),
      interviewQuestionSchema,
      promptBuilder.getSystemInstruction()
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

    return interviewRepository.updateSession(sessionId, {
      status: 'Completed',
      summary: parsedJSON
    });
  }
}

export default new InterviewService();
