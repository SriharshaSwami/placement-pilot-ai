import CustomError from '../../errors/CustomError.js';

export const validateSchema = (data, requiredKeys) => {
  if (!data || typeof data !== 'object') {
    throw new CustomError('AI response is not a valid JSON object', 500, 'AI_VALIDATION_ERROR');
  }

  const missingKeys = requiredKeys.filter(key => !(key in data));
  
  if (missingKeys.length > 0) {
    throw new CustomError(`AI response missing required fields: ${missingKeys.join(', ')}`, 500, 'AI_VALIDATION_ERROR');
  }

  return true;
};
