import Job from '../models/Job.js';
import Resume from '../models/Resume.js';
import InterviewSession from '../models/InterviewSession.js';
import embeddingService from './embedding.service.js';

class SearchService {
  async semanticSearch(userId, queryText) {
    if (!queryText || queryText.trim() === '') {
      return { jobs: [], resumes: [], interviews: [] };
    }

    // Embed the query (do not log this as it's very frequent, or log as 'Search')
    const embedResult = await embeddingService.generateEmbeddingIfChanged(queryText, null, {
      userId,
      sourceType: 'Search',
      sourceId: null
    });

    if (!embedResult || !embedResult.embedding) {
      return { jobs: [], resumes: [], interviews: [] };
    }
    const queryVector = embedResult.embedding;

    // Fetch all user data
    const [jobs, resumes, interviews] = await Promise.all([
      Job.find({ userId }).lean(),
      Resume.find({ userId }).lean(),
      InterviewSession.find({ userId, status: 'Completed' }).lean()
    ]);

    // Compute similarities
    const rankItems = (items) => {
      return items
        .filter(item => item.embedding && item.embedding.length > 0)
        .map(item => ({
          ...item,
          similarityScore: embeddingService.calculateSimilarity(queryVector, item.embedding)
        }))
        .filter(item => item.similarityScore > 0.4) // Arbitrary minimum threshold for relevance
        .sort((a, b) => b.similarityScore - a.similarityScore);
    };

    return {
      jobs: rankItems(jobs),
      resumes: rankItems(resumes),
      interviews: rankItems(interviews)
    };
  }
}

export default new SearchService();
