import KnowledgeMetadata from '../models/KnowledgeMetadata.js';
import { Chunker } from '../ai/rag/chunker.js';
import embeddingService from '../ai/rag/embedding.service.js';
import vectorRepository from '../ai/rag/vector.repository.js';
import CustomError from '../errors/CustomError.js';

class KnowledgeService {

  async getIndexedDocuments(userId) {
    return KnowledgeMetadata.find({ userId }).sort({ updatedAt: -1 });
  }

  async indexDocument(userId, documentId, documentType, rawText) {
    if (!rawText) throw new CustomError('Cannot index empty document', 400);

    // 1. Create or Update Metadata Status to Indexing
    let meta = await KnowledgeMetadata.findOneAndUpdate(
      { userId, documentId, documentType },
      { status: 'Indexing', errorMessage: null },
      { upsert: true, new: true }
    );

    try {
      // 2. Chunk the document
      const chunks = Chunker.chunkText(rawText, { userId: userId.toString(), documentId, documentType });
      
      // 3. Generate Embeddings in batch
      const textsToEmbed = chunks.map(c => c.text);
      const embeddings = await embeddingService.generateBatchEmbeddings(textsToEmbed);
      
      const metadatas = chunks.map(c => c.metadata);

      // 4. Delete old vectors if they exist (Re-indexing)
      await vectorRepository.deleteDocument(documentId);

      // 5. Store in Vector DB
      await vectorRepository.addVectors(embeddings, metadatas, textsToEmbed);

      // 6. Mark successful
      meta.status = 'Indexed';
      meta.chunkCount = chunks.length;
      meta.version += 1;
      await meta.save();

      return meta;
    } catch (error) {
      console.error('RAG Indexing Error:', error);
      meta.status = 'Failed';
      meta.errorMessage = error.message;
      await meta.save();
      throw new CustomError('Failed to index document into RAG', 500);
    }
  }

  async deleteDocumentIndex(userId, documentId) {
    await vectorRepository.deleteDocument(documentId);
    await KnowledgeMetadata.findOneAndDelete({ userId, documentId });
    return true;
  }
}

export default new KnowledgeService();
