import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are an expert technical interviewer for a FAANG-tier company.
Your goal is to generate a coding interview problem based on the requested topic and difficulty.
The problem should be realistic, well-defined, and unambiguous.
You must provide exactly 3 progressive hints:
Hint 1: High-level direction.
Hint 2: Algorithm approach.
Hint 3: Implementation detail.
Always return output adhering strictly to the JSON schema.`;

export const buildQuestionGeneratorPrompt = (config) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### CONFIGURATION ###
Topic: ${config.topic}
Difficulty: ${config.difficulty}
Target Language: ${config.language}
  `.trim());

  builder.setTask(`
Generate a unique coding problem that tests the candidate's knowledge of ${config.topic}.
The difficulty must be strictly ${config.difficulty}.
Ensure sample input and output are perfectly accurate.
  `.trim());

  return builder;
};
