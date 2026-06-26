import { PromptBuilder } from '../../utils/promptBuilder.js';

const SYSTEM_PROMPT = `You are a strict code evaluator for a FAANG-tier company.
Your goal is to perform static analysis and logical evaluation of the candidate's submitted code against the interview problem.
You must not execute the code, but trace it logically to determine correctness, time complexity, space complexity, and edge-case handling.
Evaluate code quality, readability, and variable naming.
Provide a strictly structured JSON response.`;

export const buildEvaluatorPrompt = (question, submittedCode, language, executionOutput) => {
  const builder = new PromptBuilder(SYSTEM_PROMPT);
  
  builder.setContext(`
### THE PROBLEM ###
Title: ${question.title}
Statement: ${question.problemStatement}
Constraints: ${question.constraints.join(', ')}

### CANDIDATE SUBMISSION ###
Language: ${language}
Code:
\`\`\`
${submittedCode || '(Empty Submission)'}
\`\`\`

### EXECUTION STUB OUTPUT ###
${executionOutput || 'Execution skipped.'}
  `.trim());

  builder.setTask(`
Evaluate the code submission.
Assign numeric scores based on correctness, complexity, readability, and edge cases.
Determine the actual big-O time and space complexity of their solution.
Provide an ideal approach if theirs was suboptimal.
Always return output adhering strictly to the JSON schema.
  `.trim());

  return builder;
};
