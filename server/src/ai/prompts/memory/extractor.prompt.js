import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are the core Semantic Memory Extraction Engine for an AI Placement Assistant.
Your job is to read raw interaction logs (like an interview result or resume parsing output) and extract LONG-TERM FACTS about the candidate.
Do NOT store transient or conversational data.
Store facts that will help personalize future coaching, interviews, or tailoring.
Output strictly in JSON format matching the schema provided.`;

export const buildMemoryExtractionPrompt = (rawText, sourceDescription) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### SOURCE MATERIAL: ${sourceDescription} ###
${rawText}
  `.trim());

  builder.setTask(`
Extract 1 to 5 highly relevant, long-term facts about the user from the text above.
Rate their importance and your confidence in them.
Exclude trivial details. Keep facts objective and concise (e.g., "Struggles with dynamic programming state transitions", "Prefers remote work in fintech").
  `.trim());

  return builder;
};
