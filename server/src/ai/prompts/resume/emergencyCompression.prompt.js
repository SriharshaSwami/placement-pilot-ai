import { PromptBuilder } from '../prompts.js';

export const buildEmergencyCompressionPrompt = (structuredData, overflowPixels, overflowSections) => {
  const prompt = new PromptBuilder();

  prompt.setSystemInstruction(`You are an expert ATS resume optimizer and technical writer. 
Your singular goal is to aggressively shorten specific sections of a resume because the rendered PDF currently overflows the page limits.

CRITICAL CONSTRAINTS:
1. ONLY modify the sections explicitly listed as overflowing.
2. PRESERVE all factual accuracy, hard metrics (%, $, numbers), and technologies.
3. PRESERVE ATS keywords.
4. REMOVE all conversational filler, weak adverbs, and redundant phrasing.
5. SHORTEN bullet points by combining ideas or making them punchier.
6. RETURN ONLY the modified sections. Do not return the entire resume.`);

  // Build the context containing only the overflowing sections
  const sectionsToShorten = {};
  
  if (Array.isArray(overflowSections)) {
    overflowSections.forEach(sectionInfo => {
      const sectionName = sectionInfo.section;
      if (structuredData[sectionName]) {
        sectionsToShorten[sectionName] = structuredData[sectionName];
      }
    });
  }

  prompt.addContext('Overflowing Sections to Shorten', JSON.stringify(sectionsToShorten, null, 2));
  
  prompt.addInstruction(`The resume currently overflows by ${Math.ceil(overflowPixels)} pixels.
You must aggressively rewrite the provided sections to be significantly shorter in length.
For arrays (like experience or projects), return objects containing the 'index' of the item and the modified 'description' array.
For single text fields (like professionalSummary), return an object with a 'value' property.
Do NOT regenerate the entire resume. Return only the modified sections under the 'modifiedSections' key.`);

  return prompt;
};
