import { ErrorConstants } from '../constants/error';
import { BaseError } from './BaseError';

export class LLMRequestError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorConstants.names.LLM_REQUEST_ERROR, message, context);
  }
}
