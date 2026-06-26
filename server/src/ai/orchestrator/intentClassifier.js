import geminiAdapter from '../adapters/gemini.adapter.js';
import { intentClassifierSchema } from '../schemas/intentClassifier.schema.js';
import { PromptBuilder } from '../utils/promptBuilder.js';

class IntentClassifier {
  async classify(queryText) {
    const builder = new PromptBuilder('You are the AI Orchestrator Gateway. Classify the intent of the user query and strictly return a JSON object. You must also suggest the exact sequential array of agents required to fulfill the request.');
    builder.setTask(`Classify this query: "${queryText}"`);

    try {
      const { parsedJSON } = await geminiAdapter.generateStructuredJSON(
        builder.buildContent(),
        intentClassifierSchema,
        builder.getSystemInstruction()
      );

      // Default fallback if parsing fails or confidence is too low
      if (!parsedJSON || parsedJSON.confidence < 5) {
        return { intent: 'GENERAL_SUPPORT', suggestedAgents: ['CareerAgent'] };
      }

      return { intent: parsedJSON.intent, suggestedAgents: parsedJSON.suggestedAgents };
    } catch (err) {
      console.error('Intent Classification Error:', err);
      // Fallback
      return { intent: 'GENERAL_SUPPORT', suggestedAgents: ['CareerAgent'] };
    }
  }
}

export default new IntentClassifier();
