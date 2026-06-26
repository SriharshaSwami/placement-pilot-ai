import memoryAdapter from './adapters/memory.adapter.js';

class VectorRepository {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async addVectors(vectors, metadatas, texts) {
    return this.adapter.addVectors(vectors, metadatas, texts);
  }

  async search(queryVector, topK = 5, filter = {}) {
    return this.adapter.search(queryVector, topK, filter);
  }

  async deleteDocument(documentId) {
    return this.adapter.deleteByDocumentId(documentId);
  }
}

// Injecting the robust memory adapter to avoid native C++ bindings for now.
// To migrate to Pinecone, simply inject `new PineconeAdapter()` here.
export default new VectorRepository(memoryAdapter);
