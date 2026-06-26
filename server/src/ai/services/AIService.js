import geminiAdapter from '../adapters/GeminiAdapter.js';
import PromptBuilder from '../prompts/PromptBuilder.js';
import ResponseParser from '../parsers/ResponseParser.js';
import OutputValidator from '../validators/OutputValidator.js';

class AIService {
  async executeWorkflow({ systemPrompt, instructions, context, query, schema, requiredFields, model }) {
    const builder = new PromptBuilder()
      .setSystemPrompt(systemPrompt)
      .setDeveloperInstructions(instructions)
      .setContext(context)
      .setUserQuery(query)
      .setOutputSchema(schema);

    const finalPrompt = builder.build();
    
    // Call Model Adapter
    const rawResponse = await geminiAdapter.generateContent(finalPrompt, model);

    // Parse and Validate
    const parsedData = ResponseParser.parseJSON(rawResponse);
    OutputValidator.validate(parsedData, requiredFields);

    return parsedData;
  }
}

export default new AIService();
