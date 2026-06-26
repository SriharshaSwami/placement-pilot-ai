// Pure Math helper for cosine similarity
export const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * In-Memory Adapter.
 * Exact-KNN vector search. 
 * Used for development to completely avoid FAISS/C++ build errors on Windows.
 * This perfectly mimics the interface required for VectorRepository.
 */
class MemoryAdapter {
  constructor() {
    this.store = [];
  }

  async addVectors(vectors, metadatas, texts) {
    for (let i = 0; i < vectors.length; i++) {
      this.store.push({
        vector: vectors[i],
        metadata: metadatas[i],
        text: texts[i]
      });
    }
    return true;
  }

  async search(queryVector, topK = 5, filter = {}) {
    // Filter by exact match (e.g., userId)
    let candidates = this.store;
    if (Object.keys(filter).length > 0) {
      candidates = candidates.filter(item => {
        for (const key in filter) {
          if (item.metadata[key] !== filter[key]) return false;
        }
        return true;
      });
    }

    // Calculate similarity
    const scored = candidates.map(item => ({
      ...item,
      score: cosineSimilarity(queryVector, item.vector)
    }));

    // Sort descending by score
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, topK).map(res => ({
      text: res.text,
      metadata: res.metadata,
      score: res.score
    }));
  }

  async deleteByDocumentId(documentId) {
    this.store = this.store.filter(item => item.metadata.documentId !== documentId);
    return true;
  }
}

export default new MemoryAdapter();
