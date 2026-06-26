import codingRepository from '../repositories/coding.repository.js';
import CustomError from '../errors/CustomError.js';
import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { validateSchema } from '../ai/validators/schema.validator.js';
import { buildQuestionGeneratorPrompt } from '../ai/prompts/coding/generator.prompt.js';
import { buildEvaluatorPrompt } from '../ai/prompts/coding/evaluator.prompt.js';
import { codingQuestionSchema } from '../ai/schemas/codingQuestion.schema.js';
import { codingEvaluationSchema } from '../ai/schemas/codingEvaluation.schema.js';
import codeExecutionService from './codeExecution.service.js';

class CodingService {
  async setupSession(userId, config) {
    const promptBuilder = buildQuestionGeneratorPrompt(config);
    
    const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
      promptBuilder.buildContent(),
      codingQuestionSchema,
      promptBuilder.getSystemInstruction()
    );

    validateSchema(parsedJSON, codingQuestionSchema.required);

    return codingRepository.create({
      userId,
      config,
      question: parsedJSON
    });
  }

  async getSession(userId, sessionId) {
    const session = await codingRepository.findById(sessionId);
    if (!session || session.userId.toString() !== userId.toString()) {
      throw new CustomError('Coding session not found', 404);
    }
    return session;
  }

  async listSessions(userId) {
    return codingRepository.findByUserId(userId);
  }

  async requestHint(userId, sessionId) {
    const session = await this.getSession(userId, sessionId);
    if (session.status !== 'Active') throw new CustomError('Session is closed', 400);

    if (session.hintsUsed >= session.question.hints.length) {
      throw new CustomError('No more hints available', 400);
    }

    session.hintsUsed += 1;
    return session.save();
  }

  async submitCode(userId, sessionId, code) {
    const session = await this.getSession(userId, sessionId);
    if (session.status !== 'Active') throw new CustomError('Session is already completed', 400);

    // 1. Execute Code (Stubbed for now)
    const executionResult = await codeExecutionService.runCode(session.config.language, code, session.question.sampleOutput);
    
    // 2. Evaluate statically using AI
    const promptBuilder = buildEvaluatorPrompt(session.question, code, session.config.language, executionResult.stdout);
    
    const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
      promptBuilder.buildContent(),
      codingEvaluationSchema,
      promptBuilder.getSystemInstruction()
    );

    validateSchema(parsedJSON, codingEvaluationSchema.required);

    // 3. Complete Session
    session.submittedCode = code;
    session.executionOutput = executionResult.stdout;
    session.evaluation = parsedJSON;
    session.status = 'Completed';
    session.completedAt = new Date();

    return session.save();
  }
}

export default new CodingService();
