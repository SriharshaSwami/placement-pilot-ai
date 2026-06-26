import CustomError from '../../../errors/CustomError.js';

class ResponseParser {
  static parseJSON(responseText) {
    try {
      // Clean up markdown formatting if present (e.g., ```json ... ```)
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      throw new CustomError('Failed to parse AI response as JSON', 500, 'AI_PARSE_ERROR');
    }
  }
}

export default ResponseParser;
