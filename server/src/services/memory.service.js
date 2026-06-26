import memoryRepository from '../repositories/memory.repository.js';
import geminiAdapter from '../ai/adapters/gemini.adapter.js';
import { memoryExtractorSchema } from '../ai/schemas/memoryExtractor.schema.js';
import { buildMemoryExtractionPrompt } from '../ai/prompts/memory/extractor.prompt.js';
import CustomError from '../errors/CustomError.js';

class MemoryService {
  async getAllMemories(userId) {
    return memoryRepository.findActiveByUserId(userId);
  }

  async extractAndStore(userId, rawText, sourceDescription) {
    if (!rawText) return [];

    try {
      const promptBuilder = buildMemoryExtractionPrompt(rawText, sourceDescription);
      const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
        promptBuilder.buildContent(),
        memoryExtractorSchema,
        promptBuilder.getSystemInstruction()
      );

      if (parsedJSON && parsedJSON.memories && parsedJSON.memories.length > 0) {
        // High confidence filter to avoid noise
        const confidentMemories = parsedJSON.memories
          .filter(m => m.confidence >= 5)
          .map(m => ({ ...m, userId, source: sourceDescription }));

        if (confidentMemories.length > 0) {
          await memoryRepository.saveMany(confidentMemories);
        }
        return confidentMemories;
      }
      return [];
    } catch (error) {
      console.error('Memory Extraction Failed:', error);
      // We don't throw an error here because memory extraction is usually a background/secondary task
      // We don't want to crash the primary flow (like returning an interview result) if memory extraction fails.
      return [];
    }
  }

  async deleteMemory(userId, memoryId) {
    const deleted = await memoryRepository.hardDeleteMemory(userId, memoryId);
    if (!deleted) throw new CustomError('Memory not found or unauthorized', 404);
    return true;
  }

  async resetMemory(userId) {
    await memoryRepository.hardResetMemories(userId);
    return true;
  }

  async exportMemories(userId) {
    const memories = await memoryRepository.findActiveByUserId(userId);
    // Remove internal ObjectIds before export
    return memories.map(m => ({
      category: m.category,
      fact: m.fact,
      importance: m.importance,
      confidence: m.confidence,
      source: m.source,
      date: m.createdAt
    }));
  }
}

export default new MemoryService();
