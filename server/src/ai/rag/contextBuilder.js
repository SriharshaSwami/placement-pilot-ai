export class ContextBuilder {
  static buildContextString(retrievedChunks) {
    if (!retrievedChunks || retrievedChunks.length === 0) return '';

    // Sort by relevance score (already sorted by Retriever, but ensuring safety)
    const sorted = [...retrievedChunks].sort((a, b) => b.score - a.score);

    // Remove absolute duplicates just in case
    const uniqueChunks = [];
    const seenTexts = new Set();
    
    for (const chunk of sorted) {
      if (!seenTexts.has(chunk.text)) {
        uniqueChunks.push(chunk);
        seenTexts.add(chunk.text);
      }
    }

    let contextString = '### RELEVANT USER KNOWLEDGE CONTEXT ###\n';
    uniqueChunks.forEach((chunk, index) => {
      contextString += `\n[Source: ${chunk.metadata.documentType} | Match Score: ${(chunk.score * 100).toFixed(1)}%]\n`;
      contextString += `${chunk.text}\n`;
    });

    return contextString;
  }
}
