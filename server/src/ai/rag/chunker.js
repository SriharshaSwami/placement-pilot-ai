import { v4 as uuidv4 } from 'uuid';

export class Chunker {
  static chunkText(text, metadata = {}, chunkSize = 1000, overlap = 200) {
    if (!text || typeof text !== 'string') return [];

    const chunks = [];
    let i = 0;
    let chunkIndex = 0;

    while (i < text.length) {
      let end = i + chunkSize;
      
      // Don't cut off words if possible
      if (end < text.length) {
        const nextSpace = text.indexOf(' ', end);
        if (nextSpace !== -1 && nextSpace - end < 50) {
          end = nextSpace;
        }
      }

      const chunkText = text.substring(i, end).trim();
      if (chunkText) {
        chunks.push({
          chunkId: uuidv4(),
          text: chunkText,
          metadata: {
            ...metadata,
            chunkIndex,
            characterCount: chunkText.length
          }
        });
      }

      i = end - overlap;
      chunkIndex++;
    }

    return chunks;
  }
}
