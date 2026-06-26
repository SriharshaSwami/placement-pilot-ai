import CustomError from '../../../errors/CustomError.js';

class OutputValidator {
  static validate(data, requiredFields = []) {
    if (typeof data !== 'object' || data === null) {
      throw new CustomError('AI output is not a valid object', 500, 'AI_VALIDATION_ERROR');
    }

    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new CustomError(`AI output missing required field: ${field}`, 500, 'AI_VALIDATION_ERROR');
      }
    }

    return true;
  }
}

export default OutputValidator;
