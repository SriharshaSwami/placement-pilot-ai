import embeddingService from './embedding.service.js';
import vectorRepository from './vector.repository.js';

class Retriever {
  async retrieve(queryText, userId, topK = 5, documentType = null) {
    if (!queryText) return [];

    // 1. Embed Query
    const queryVector = await embeddingService.generateEmbedding(queryText);

    // 2. Build Filter
    const filter = { userId: userId.toString() };
    if (documentType) {
      filter.documentType = documentType;
    }

    // 3. Search Vector Store
    const results = await vectorRepository.search(queryVector, topK, filter);

    return results;
  }
}

export default new Retriever();
